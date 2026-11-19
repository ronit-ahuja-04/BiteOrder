function fis = buildFIS()
% Mamdani FLC on normalised universe [-1,1]. Inputs: error, change of error. Output: control.
fis = mamfis('Name','FLC','AndMethod','min','OrMethod','max', ...
    'ImplicationMethod','min','AggregationMethod','max','DefuzzificationMethod','centroid');
fis = addInput(fis,[-1 1],'Name','e');
fis = addInput(fis,[-1 1],'Name','de');
fis = addOutput(fis,[-1 1],'Name','u');
names = {'N','Z','P'};
mfp = [-1 -1 0; -1 0 1; 0 1 1];
for i = 1:3
    fis = addMF(fis,'e', 'trimf',mfp(i,:),'Name',names{i});
    fis = addMF(fis,'de','trimf',mfp(i,:),'Name',names{i});
    fis = addMF(fis,'u', 'trimf',mfp(i,:),'Name',names{i});
end
% Rule format: [e de u weight AND(1)]  (1=N, 2=Z, 3=P)
rules = [1 1 1 1 1; 1 2 1 1 1; 1 3 2 1 1;
         2 1 1 1 1; 2 2 2 1 1; 2 3 3 1 1;
         3 1 2 1 1; 3 2 3 1 1; 3 3 3 1 1];
fis = addRule(fis,rules);
end
