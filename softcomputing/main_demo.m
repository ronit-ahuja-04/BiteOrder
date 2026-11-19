%% Soft Computing CA3 demo: Mamdani FLC + GA tuning + PSO tuning + comparison
clear; clc; close all; rng(1);
fis = buildFIS();

%% 1. Show the FLC
figure('Name','Membership functions'); subplot(3,1,1); plotmf(fis,'input',1); title('e');
subplot(3,1,2); plotmf(fis,'input',2); title('de'); subplot(3,1,3); plotmf(fis,'output',1); title('u');
figure('Name','Control surface'); gensurf(fis);
% ruleview(fis)   % uncomment to demo interactive rule viewer

%% 2. Untuned baseline
p0 = [1 0.1 1];
figure('Name','Baseline'); J0 = simulateFLC(p0,fis,true);
fprintf('Baseline ITAE = %.4f\n',J0);

%% 3. GA tuning of [Ke Kde Ku]
lb=[0.1 0.01 0.5]; ub=[5 2 10]; cost=@(p) simulateFLC(p,fis);
gaOpts = optimoptions('ga','PopulationSize',30,'MaxGenerations',40,'Display','off', ...
    'CrossoverFraction',0.8,'EliteCount',2,'PlotFcn',@gaplotbestf);
tic; [pGA,JGA] = ga(cost,3,[],[],[],[],lb,ub,[],gaOpts); tGA=toc;
fprintf('GA : p=[%.3f %.3f %.3f] ITAE=%.4f time=%.1fs\n',pGA,JGA,tGA);

%% 4. PSO tuning
psoOpts = optimoptions('particleswarm','SwarmSize',30,'MaxIterations',40,'Display','off','PlotFcn',@pswplotbestf);
tic; [pPSO,JPSO] = particleswarm(cost,3,lb,ub,psoOpts); tPSO=toc;
fprintf('PSO: p=[%.3f %.3f %.3f] ITAE=%.4f time=%.1fs\n',pPSO,JPSO,tPSO);

%% 5. Comparison
figure('Name','Comparison');
[~,t,x0]=simulateFLC(p0,fis); [~,~,xg]=simulateFLC(pGA,fis); [~,~,xp]=simulateFLC(pPSO,fis);
plot(t,x0,t,xg,t,xp,'LineWidth',1.5); yline(1,'--k'); grid on;
legend('Untuned','GA-tuned','PSO-tuned','Setpoint'); xlabel('Time (s)'); ylabel('Output');
title('Step response comparison');
T = table(["Untuned";"GA";"PSO"],[J0;JGA;JPSO],[0;tGA;tPSO],'VariableNames',{'Method','ITAE','Time_s'});
disp(T);
