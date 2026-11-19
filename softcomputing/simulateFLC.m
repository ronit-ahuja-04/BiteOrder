function [J,t,x] = simulateFLC(p,fis,doPlot)
% p = [Ke Kde Ku] scaling gains. Plant: x'' + x' + 2x = 2u (second order). Cost = ITAE.
if nargin<3, doPlot=false; end
dt=0.05; T=10; t=0:dt:T; r=1;
x1=0; x2=0; eprev=r; J=0; x=zeros(size(t));
opt = evalfisOptions('EmptyOutputFuzzySetMessage','none','NoRuleFiredMessage','none','OutOfRangeInputValueMessage','none');
for k=1:numel(t)
    e = r-x1; de=(e-eprev)/dt; eprev=e;
    en = max(-1,min(1,p(1)*e)); den = max(-1,min(1,p(2)*de));
    u = p(3)*evalfis(fis,[en den],opt);
    x2 = x2 + dt*(-x2-2*x1+2*u);
    x1 = x1 + dt*x2;
    x(k)=x1; J = J + t(k)*abs(e)*dt;
    if ~isfinite(J) || abs(x1)>1e3, J=1e6; return; end
end
if doPlot
    plot(t,x,'LineWidth',1.5); hold on; yline(r,'--r'); grid on;
    xlabel('Time (s)'); ylabel('Output'); title(sprintf('Step response, ITAE = %.4f',J));
end
end
