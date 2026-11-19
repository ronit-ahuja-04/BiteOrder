%% CA3: Uber Driver Tipper. Mamdani FLC (TRAPEZOIDAL MFs) + GA + PSO  (weights: service 50%, punctuality 20%)
clear; clc; close all; rng(1);

%% 1. Target policy on an 11x11 grid
W_S = 0.5;  W_P = 0.2;                           % weights (change here only)
[S,F] = meshgrid(0:10,0:10);
X = [S(:) F(:)];
target = 2 + 1.5*(W_S*X(:,1) + W_P*X(:,2));      % ranges 2..12.5 %

%% 2. Baseline FLC and plots
p0 = [5 12.5 20];
fis0 = buildTipper(p0);
figure('Name','Input/Output MFs');
subplot(3,1,1); plotmf(fis0,'input',1);  title('Service');
subplot(3,1,2); plotmf(fis0,'input',2);  title('Punctuality');
subplot(3,1,3); plotmf(fis0,'output',1); title('Tip (baseline)');
figure('Name','Control surface (baseline)'); gensurf(fis0);
J0 = tipCost(p0,X,target);
fprintf('Baseline RMSE = %.4f\n',J0);
fprintf('Example: service=8, punctuality=6 -> tip = %.2f %% (target %.2f %%)\n', ...
    evalfis(fis0,[8 6]), 2+1.5*(W_S*8+W_P*6));

%% 3. GA tuning of the output MF centres [c1 c2 c3]
lb = [0 3 6]; ub = [10 17 25];                   % wider bounds: target is lower now
cost = @(p) tipCost(p,X,target);
gaOpts = optimoptions('ga','PopulationSize',30,'MaxGenerations',40,'Display','off', ...
    'CrossoverFraction',0.8,'EliteCount',2,'PlotFcn',@gaplotbestf);
tic; [pGA,JGA] = ga(cost,3,[],[],[],[],lb,ub,[],gaOpts); tGA = toc;
fprintf('GA : centres=[%.2f %.2f %.2f] RMSE=%.4f time=%.1fs\n',pGA,JGA,tGA);

%% 4. PSO tuning
psoOpts = optimoptions('particleswarm','SwarmSize',30,'MaxIterations',40,'Display','off', ...
    'PlotFcn',@pswplotbestf);
tic; [pPSO,JPSO] = particleswarm(cost,3,lb,ub,psoOpts); tPSO = toc;
fprintf('PSO: centres=[%.2f %.2f %.2f] RMSE=%.4f time=%.1fs\n',pPSO,JPSO,tPSO);

%% 5. Comparison
fisGA = buildTipper(pGA); fisPSO = buildTipper(pPSO);
figure('Name','Tuned control surface (GA)'); gensurf(fisGA);
figure('Name','Comparison');
sv = 0:10; Xs = [sv' 5*ones(11,1)];              % sweep service, punctuality = 5
plot(sv, 2+1.5*(W_S*sv+W_P*5),'k--', sv,evalfis(fis0,Xs),sv,evalfis(fisGA,Xs), ...
    sv,evalfis(fisPSO,Xs),'LineWidth',1.5); grid on;
legend('Target','Baseline','GA-tuned','PSO-tuned','Location','northwest');
xlabel('Service quality (punctuality = 5)'); ylabel('Tip (%)'); title('Tip vs service');
T = table(["Baseline";"GA";"PSO"],[J0;JGA;JPSO],[0;tGA;tPSO], ...
    'VariableNames',{'Method','RMSE','Time_s'}); disp(T);

%% ---------- local functions ----------
function fis = buildTipper(p)
% p = [c1 c2 c3] centres of Low/Medium/High tip MFs (trapezoids: flat top c-1..c+1, base c-5..c+5)
c = sort(p);
fis = mamfis('Name','Tipper','AndMethod','min','OrMethod','max', ...
    'ImplicationMethod','min','AggregationMethod','max','DefuzzificationMethod','centroid');
fis = addInput(fis,[0 10],'Name','service');
fis = addMF(fis,'service','trapmf',[-5 0 1 4],'Name','poor');
fis = addMF(fis,'service','trapmf',[1 4 6 9],'Name','good');
fis = addMF(fis,'service','trapmf',[6 9 10 15],'Name','excellent');
fis = addInput(fis,[0 10],'Name','punctuality');
fis = addMF(fis,'punctuality','trapmf',[-5 0 1 4],'Name','late');
fis = addMF(fis,'punctuality','trapmf',[1 4 6 9],'Name','ontime');
fis = addMF(fis,'punctuality','trapmf',[6 9 10 15],'Name','prompt');
fis = addOutput(fis,[0 25],'Name','tip');
fis = addMF(fis,'tip','trapmf',[c(1)-5 c(1)-1 c(1)+1 c(1)+5],'Name','low');
fis = addMF(fis,'tip','trapmf',[c(2)-5 c(2)-1 c(2)+1 c(2)+5],'Name','medium');
fis = addMF(fis,'tip','trapmf',[c(3)-5 c(3)-1 c(3)+1 c(3)+5],'Name','high');
% [service punctuality tip weight connection]  1=AND, 2=OR, 0=input not used
rules = [1 1 1 1 2;      % service poor OR punctuality late     -> low
         2 0 2 1 1;      % service good                         -> medium
         3 3 3 1 2];     % service excellent OR prompt          -> high
fis = addRule(fis,rules);
end

function J = tipCost(p,X,target)
% RMSE between FLC output and the target tipping policy
fis = buildTipper(p);
y = evalfis(fis,X);
J = sqrt(mean((y-target).^2));
if ~isfinite(J), J = 1e6; end
end
