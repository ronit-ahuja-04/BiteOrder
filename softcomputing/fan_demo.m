%% EASY TOPIC: Smart Room Fan Controller. Mamdani FLC + GA tuning + PSO comparison
% Inputs : temperature (0-40 C), humidity (0-100 %).  Output: fan speed (0-100 %)
% Goal   : tune the 3 output MF centres so the FLC matches a target fan policy.
% Needs  : Fuzzy Logic Toolbox + Global Optimization Toolbox. Run: fan_demo
clear; clc; close all; rng(1);

%% 1. Target policy on an 11x11 grid
[T,H] = meshgrid(linspace(0,40,11), linspace(0,100,11));
X = [T(:) H(:)];
target = 100*(0.6*X(:,1)/40 + 0.4*X(:,2)/100);   % 0..100 %

%% 2. Baseline FLC and plots
p0 = [15 50 85];
fis0 = buildFan(p0);
figure('Name','MFs'); subplot(3,1,1); plotmf(fis0,'input',1); title('Temperature');
subplot(3,1,2); plotmf(fis0,'input',2); title('Humidity');
subplot(3,1,3); plotmf(fis0,'output',1); title('Fan speed (baseline)');
figure('Name','Surface (baseline)'); gensurf(fis0);
% ruleview(fis0)
J0 = fanCost(p0,X,target);
fprintf('Baseline RMSE = %.4f\n',J0);
fprintf('Example: 30 C, 70 %% -> fan = %.1f %% (target %.1f %%)\n', evalfis(fis0,[30 70]), 100*(0.6*30/40+0.4*0.7));

%% 3. GA tuning of [c1 c2 c3]
lb = [0 35 65]; ub = [35 65 100]; cost = @(p) fanCost(p,X,target);
gaOpts = optimoptions('ga','PopulationSize',30,'MaxGenerations',40,'Display','off', ...
    'CrossoverFraction',0.8,'EliteCount',2,'PlotFcn',@gaplotbestf);
tic; [pGA,JGA] = ga(cost,3,[],[],[],[],lb,ub,[],gaOpts); tGA = toc;
fprintf('GA : centres=[%.1f %.1f %.1f] RMSE=%.4f time=%.1fs\n',pGA,JGA,tGA);

%% 4. PSO tuning
psoOpts = optimoptions('particleswarm','SwarmSize',30,'MaxIterations',40,'Display','off','PlotFcn',@pswplotbestf);
tic; [pPSO,JPSO] = particleswarm(cost,3,lb,ub,psoOpts); tPSO = toc;
fprintf('PSO: centres=[%.1f %.1f %.1f] RMSE=%.4f time=%.1fs\n',pPSO,JPSO,tPSO);

%% 5. Comparison (sweep temperature at humidity = 50 %)
fisGA = buildFan(pGA); fisPSO = buildFan(pPSO);
tv = linspace(0,40,41)'; Xs = [tv 50*ones(41,1)];
figure('Name','Comparison');
plot(tv,100*(0.6*tv/40+0.4*0.5),'k--',tv,evalfis(fis0,Xs),tv,evalfis(fisGA,Xs),tv,evalfis(fisPSO,Xs),'LineWidth',1.5);
grid on; legend('Target','Baseline','GA','PSO','Location','northwest');
xlabel('Temperature (C), humidity = 50 %'); ylabel('Fan speed (%)'); title('Fan speed vs temperature');
disp(table(["Baseline";"GA";"PSO"],[J0;JGA;JPSO],[0;tGA;tPSO],'VariableNames',{'Method','RMSE','Time_s'}));

%% ---------- local functions ----------
function fis = buildFan(p)
c = sort(p);   % centres of Low/Medium/High speed (triangles, half-width 35)
fis = mamfis('Name','Fan','AndMethod','min','OrMethod','max','ImplicationMethod','min', ...
    'AggregationMethod','max','DefuzzificationMethod','centroid');
fis = addInput(fis,[0 40],'Name','temp');
fis = addMF(fis,'temp','trimf',[-20 0 20],'Name','cold');
fis = addMF(fis,'temp','trimf',[0 20 40],'Name','warm');
fis = addMF(fis,'temp','trimf',[20 40 60],'Name','hot');
fis = addInput(fis,[0 100],'Name','humidity');
fis = addMF(fis,'humidity','trimf',[-50 0 50],'Name','dry');
fis = addMF(fis,'humidity','trimf',[0 50 100],'Name','normal');
fis = addMF(fis,'humidity','trimf',[50 100 150],'Name','humid');
fis = addOutput(fis,[0 100],'Name','speed');
fis = addMF(fis,'speed','trimf',[c(1)-35 c(1) c(1)+35],'Name','low');
fis = addMF(fis,'speed','trimf',[c(2)-35 c(2) c(2)+35],'Name','medium');
fis = addMF(fis,'speed','trimf',[c(3)-35 c(3) c(3)+35],'Name','high');
% [temp humidity speed weight connection]  1=AND, 2=OR, 0=unused
rules = [1 1 1 1 1;    % cold AND dry   -> low
         2 0 2 1 1;    % warm           -> medium
         3 3 3 1 2];   % hot OR humid   -> high
fis = addRule(fis,rules);
end

function J = fanCost(p,X,target)
y = evalfis(buildFan(p),X);
J = sqrt(mean((y-target).^2));
if ~isfinite(J), J = 1e6; end
end
