// OpenFOAM Keywords and Documentation Database
export interface KeywordInfo {
    keyword: string;
    description: string;
    category: string;
    validValues?: string[];
    example?: string;
    documentation?: string;
}

export const OPENFOAM_KEYWORDS: KeywordInfo[] = [
    // ===== ControlDict Keywords =====
    {
        keyword: 'application',
        description: 'Specifies the OpenFOAM solver application to use',
        category: 'controlDict',
        example: 'application simpleFoam;',
        documentation: 'The name of the solver executable (e.g., simpleFoam, pimpleFoam, icoFoam)'
    },
    {
        keyword: 'startFrom',
        description: 'Specifies the start time of the simulation',
        category: 'controlDict',
        validValues: ['firstTime', 'startTime', 'latestTime'],
        example: 'startFrom latestTime;',
        documentation: 'Controls whether to start from first available time, specified startTime, or latest time'
    },
    {
        keyword: 'startTime',
        description: 'Start time value for the simulation',
        category: 'controlDict',
        example: 'startTime 0;',
        documentation: 'The time value from which the simulation starts (typically 0)'
    },
    {
        keyword: 'stopAt',
        description: 'Criterion for stopping the simulation',
        category: 'controlDict',
        validValues: ['endTime', 'writeNow', 'noWriteNow', 'nextWrite'],
        example: 'stopAt endTime;',
        documentation: 'Defines when the simulation should stop'
    },
    {
        keyword: 'endTime',
        description: 'End time value for the simulation',
        category: 'controlDict',
        example: 'endTime 100;',
        documentation: 'The time value at which the simulation ends'
    },
    {
        keyword: 'deltaT',
        description: 'Time step for the simulation',
        category: 'controlDict',
        example: 'deltaT 0.001;',
        documentation: 'The time increment for each iteration (can be adjusted dynamically with adjustTimeStep)'
    },
    {
        keyword: 'writeControl',
        description: 'Controls when simulation data is written',
        category: 'controlDict',
        validValues: ['timeStep', 'runTime', 'adjustableRunTime', 'clockTime', 'cpuTime'],
        example: 'writeControl timeStep;',
        documentation: 'Specifies the timing mechanism for writing output'
    },
    {
        keyword: 'writeInterval',
        description: 'Interval for writing output data',
        category: 'controlDict',
        example: 'writeInterval 50;',
        documentation: 'Frequency of writing (interpretation depends on writeControl setting)'
    },
    {
        keyword: 'purgeWrite',
        description: 'Number of time directories to retain',
        category: 'controlDict',
        example: 'purgeWrite 2;',
        documentation: 'Limits storage by keeping only the most recent N time directories (0 = keep all)'
    },
    {
        keyword: 'writeFormat',
        description: 'Format for writing output files',
        category: 'controlDict',
        validValues: ['ascii', 'binary'],
        example: 'writeFormat binary;',
        documentation: 'ASCII is human-readable but larger; binary is compact and faster'
    },
    {
        keyword: 'writePrecision',
        description: 'Number of significant digits for output',
        category: 'controlDict',
        example: 'writePrecision 8;',
        documentation: 'Controls numerical precision in output files (typically 6-12)'
    },
    {
        keyword: 'writeCompression',
        description: 'Compression for output files',
        category: 'controlDict',
        validValues: ['on', 'off', 'uncompressed', 'compressed'],
        example: 'writeCompression off;',
        documentation: 'Enable/disable gzip compression of output files'
    },
    {
        keyword: 'timeFormat',
        description: 'Format for time directory names',
        category: 'controlDict',
        validValues: ['general', 'fixed', 'scientific'],
        example: 'timeFormat general;',
        documentation: 'Controls how time values appear in directory names'
    },
    {
        keyword: 'timePrecision',
        description: 'Number of digits in time directory names',
        category: 'controlDict',
        example: 'timePrecision 6;',
        documentation: 'Precision for time directory naming'
    },
    {
        keyword: 'runTimeModifiable',
        description: 'Allow runtime modification of dictionaries',
        category: 'controlDict',
        validValues: ['true', 'false', 'yes', 'no'],
        example: 'runTimeModifiable true;',
        documentation: 'When true, allows modifying control dictionaries while simulation is running'
    },
    {
        keyword: 'adjustTimeStep',
        description: 'Enable automatic time step adjustment',
        category: 'controlDict',
        validValues: ['true', 'false', 'yes', 'no'],
        example: 'adjustTimeStep yes;',
        documentation: 'Automatically adjusts deltaT based on Courant number constraints'
    },
    {
        keyword: 'maxCo',
        description: 'Maximum Courant number',
        category: 'controlDict',
        example: 'maxCo 1.0;',
        documentation: 'Upper limit for Courant number when using adjustTimeStep'
    },
    {
        keyword: 'maxAlphaCo',
        description: 'Maximum Courant number for phase fraction',
        category: 'controlDict',
        example: 'maxAlphaCo 1.0;',
        documentation: 'Courant number limit for multiphase flows (e.g., interFoam)'
    },
    {
        keyword: 'maxDeltaT',
        description: 'Maximum allowed time step',
        category: 'controlDict',
        example: 'maxDeltaT 1.0;',
        documentation: 'Upper limit for deltaT when using adjustTimeStep'
    },
    {
        keyword: 'functions',
        description: 'Function objects for runtime post-processing',
        category: 'controlDict',
        documentation: 'Dictionary containing function objects executed during simulation'
    },
    {
        keyword: 'libs',
        description: 'Shared libraries to load',
        category: 'controlDict',
        example: 'libs ("libmyLib.so");',
        documentation: 'List of additional libraries to load at runtime'
    },

    // ===== fvSchemes Keywords =====
    {
        keyword: 'ddtSchemes',
        description: 'Time derivative discretization schemes',
        category: 'fvSchemes',
        documentation: 'Defines how temporal derivatives are discretized'
    },
    {
        keyword: 'gradSchemes',
        description: 'Gradient discretization schemes',
        category: 'fvSchemes',
        documentation: 'Defines how gradients are calculated'
    },
    {
        keyword: 'divSchemes',
        description: 'Divergence discretization schemes',
        category: 'fvSchemes',
        documentation: 'Defines how divergence terms are discretized'
    },
    {
        keyword: 'laplacianSchemes',
        description: 'Laplacian discretization schemes',
        category: 'fvSchemes',
        documentation: 'Defines how Laplacian terms are discretized'
    },
    {
        keyword: 'interpolationSchemes',
        description: 'Interpolation schemes for face values',
        category: 'fvSchemes',
        documentation: 'Defines how values are interpolated from cell centers to faces'
    },
    {
        keyword: 'snGradSchemes',
        description: 'Surface-normal gradient schemes',
        category: 'fvSchemes',
        documentation: 'Defines how surface-normal gradients are calculated'
    },
    {
        keyword: 'fluxRequired',
        description: 'Fields requiring flux calculation',
        category: 'fvSchemes',
        documentation: 'Specifies which fields need flux calculations for equation solution'
    },
    {
        keyword: 'wallDist',
        description: 'Wall distance calculation method',
        category: 'fvSchemes',
        validValues: ['meshWave', 'meshWaveFrozen', 'Poisson'],
        documentation: 'Method for calculating distance to nearest wall'
    },

    // ===== Time Schemes =====
    {
        keyword: 'Euler',
        description: 'First-order implicit Euler scheme',
        category: 'ddtScheme',
        documentation: 'Simple, stable but less accurate time integration'
    },
    {
        keyword: 'backward',
        description: 'Second-order implicit backward differencing',
        category: 'ddtScheme',
        documentation: 'More accurate than Euler, good for transient flows'
    },
    {
        keyword: 'CrankNicolson',
        description: 'Second-order Crank-Nicolson scheme',
        category: 'ddtScheme',
        example: 'default CrankNicolson 0.9;',
        documentation: 'Blends implicit and explicit (0=Euler, 1=fully implicit)'
    },
    {
        keyword: 'steadyState',
        description: 'Steady-state (no time derivative)',
        category: 'ddtScheme',
        documentation: 'For steady-state simulations with no temporal term'
    },
    {
        keyword: 'localEuler',
        description: 'Local time stepping Euler scheme',
        category: 'ddtScheme',
        documentation: 'Uses local time stepping for faster convergence to steady state'
    },

    // ===== Spatial Schemes =====
    {
        keyword: 'Gauss',
        description: 'Gauss integration using specified interpolation',
        category: 'spatialScheme',
        example: 'default Gauss linear;',
        documentation: 'Standard Gauss theorem-based integration'
    },
    {
        keyword: 'linear',
        description: 'Linear interpolation (2nd order, unbounded)',
        category: 'interpolation',
        documentation: 'Central differencing, can cause oscillations'
    },
    {
        keyword: 'linearUpwind',
        description: 'Linear upwind differencing',
        category: 'interpolation',
        example: 'div(phi,U) Gauss linearUpwind grad(U);',
        documentation: 'Upwind-biased scheme with gradient correction'
    },
    {
        keyword: 'upwind',
        description: 'First-order upwind differencing',
        category: 'interpolation',
        documentation: 'Highly stable but diffusive, use for initial iterations'
    },
    {
        keyword: 'QUICK',
        description: 'Quadratic Upstream Interpolation',
        category: 'interpolation',
        documentation: 'Third-order accuracy, can cause oscillations'
    },
    {
        keyword: 'limitedLinear',
        description: 'Limited linear scheme',
        category: 'interpolation',
        example: 'div(phi,k) Gauss limitedLinear 1;',
        documentation: 'Bounded linear scheme with limiter coefficient'
    },
    {
        keyword: 'vanLeer',
        description: 'Van Leer TVD scheme',
        category: 'interpolation',
        documentation: 'Total Variation Diminishing scheme, good for shocks'
    },
    {
        keyword: 'MUSCL',
        description: 'Monotonic Upstream Scheme for Conservation Laws',
        category: 'interpolation',
        documentation: 'High-order scheme with good shock capturing'
    },
    {
        keyword: 'bounded',
        description: 'Bounded convection scheme',
        category: 'interpolation',
        example: 'div(phi,k) bounded Gauss upwind;',
        documentation: 'Ensures boundedness of the solution'
    },
    {
        keyword: 'cellLimited',
        description: 'Cell-limited gradient',
        category: 'gradient',
        example: 'grad(U) cellLimited Gauss linear 1;',
        documentation: 'Limits gradient to prevent overshoots'
    },
    {
        keyword: 'faceLimited',
        description: 'Face-limited gradient',
        category: 'gradient',
        documentation: 'Limits gradient at faces'
    },
    {
        keyword: 'leastSquares',
        description: 'Least squares gradient',
        category: 'gradient',
        documentation: 'Accurate gradient calculation using least squares'
    },
    {
        keyword: 'corrected',
        description: 'Corrected surface-normal gradient',
        category: 'snGradScheme',
        documentation: 'Uses non-orthogonal correction for better accuracy'
    },
    {
        keyword: 'uncorrected',
        description: 'Uncorrected surface-normal gradient',
        category: 'snGradScheme',
        documentation: 'No non-orthogonal correction, faster but less accurate'
    },
    {
        keyword: 'limited',
        description: 'Limited non-orthogonal correction',
        category: 'snGradScheme',
        example: 'default limited 0.5;',
        documentation: 'Limits correction with coefficient (0-1)'
    },
    {
        keyword: 'orthogonal',
        description: 'Orthogonal gradient (no correction)',
        category: 'snGradScheme',
        documentation: 'Assumes orthogonal mesh, fastest but only for orthogonal meshes'
    },

    // ===== fvSolution Keywords =====
    {
        keyword: 'solvers',
        description: 'Linear solver settings for each field',
        category: 'fvSolution',
        documentation: 'Dictionary defining solver settings for each equation'
    },
    {
        keyword: 'relaxationFactors',
        description: 'Under-relaxation factors for stability',
        category: 'fvSolution',
        documentation: 'Controls how much of new solution to blend with old (0-1)'
    },
    {
        keyword: 'SIMPLE',
        description: 'SIMPLE algorithm settings',
        category: 'fvSolution',
        documentation: 'Semi-Implicit Method for Pressure-Linked Equations (steady-state)'
    },
    {
        keyword: 'PISO',
        description: 'PISO algorithm settings',
        category: 'fvSolution',
        documentation: 'Pressure Implicit with Splitting of Operators (transient)'
    },
    {
        keyword: 'PIMPLE',
        description: 'PIMPLE algorithm settings',
        category: 'fvSolution',
        documentation: 'Merged PISO-SIMPLE algorithm (transient with large time steps)'
    },
    {
        keyword: 'nCorrectors',
        description: 'Number of PISO correctors',
        category: 'fvSolution',
        example: 'nCorrectors 2;',
        documentation: 'Number of pressure-velocity corrections per time step'
    },
    {
        keyword: 'nNonOrthogonalCorrectors',
        description: 'Number of non-orthogonal correctors',
        category: 'fvSolution',
        example: 'nNonOrthogonalCorrectors 1;',
        documentation: 'Additional corrections for non-orthogonal meshes (typically 0-2)'
    },
    {
        keyword: 'nOuterCorrectors',
        description: 'Number of outer correctors (PIMPLE)',
        category: 'fvSolution',
        example: 'nOuterCorrectors 1;',
        documentation: 'Outer iterations in PIMPLE loop'
    },
    {
        keyword: 'residualControl',
        description: 'Convergence criteria for outer iterations',
        category: 'fvSolution',
        documentation: 'Sets residual targets for convergence checking'
    },
    {
        keyword: 'pRefCell',
        description: 'Reference cell for pressure',
        category: 'fvSolution',
        example: 'pRefCell 0;',
        documentation: 'Cell index where pressure reference is set (for closed domains)'
    },
    {
        keyword: 'pRefValue',
        description: 'Reference pressure value',
        category: 'fvSolution',
        example: 'pRefValue 0;',
        documentation: 'Pressure value at reference cell'
    },
    {
        keyword: 'momentumPredictor',
        description: 'Enable momentum predictor step',
        category: 'fvSolution',
        validValues: ['true', 'false', 'yes', 'no'],
        documentation: 'Solve momentum equation before pressure correction'
    },
    {
        keyword: 'consistent',
        description: 'Use consistent formulation (SIMPLE)',
        category: 'fvSolution',
        validValues: ['true', 'false', 'yes', 'no'],
        documentation: 'Enables SIMPLEC-like formulation for better convergence'
    },

    // ===== Linear Solvers =====
    {
        keyword: 'PCG',
        description: 'Preconditioned Conjugate Gradient',
        category: 'linearSolver',
        documentation: 'For symmetric matrices (e.g., pressure, scalar transport)'
    },
    {
        keyword: 'PBiCG',
        description: 'Preconditioned Bi-Conjugate Gradient',
        category: 'linearSolver',
        documentation: 'For asymmetric matrices (deprecated, use PBiCGStab)'
    },
    {
        keyword: 'PBiCGStab',
        description: 'Stabilized Preconditioned Bi-Conjugate Gradient',
        category: 'linearSolver',
        documentation: 'For asymmetric matrices (e.g., momentum with convection)'
    },
    {
        keyword: 'smoothSolver',
        description: 'Iterative solver with smoother',
        category: 'linearSolver',
        documentation: 'Uses smoother like Gauss-Seidel, good for simple problems'
    },
    {
        keyword: 'GAMG',
        description: 'Generalized Geometric-Algebraic Multi-Grid',
        category: 'linearSolver',
        documentation: 'Efficient multigrid solver for large systems'
    },
    {
        keyword: 'diagonal',
        description: 'Diagonal solver (explicit)',
        category: 'linearSolver',
        documentation: 'For purely explicit equations'
    },

    // ===== Preconditioners =====
    {
        keyword: 'DIC',
        description: 'Diagonal Incomplete Cholesky',
        category: 'preconditioner',
        documentation: 'Preconditioner for symmetric matrices'
    },
    {
        keyword: 'FDIC',
        description: 'Faster Diagonal Incomplete Cholesky',
        category: 'preconditioner',
        documentation: 'Optimized version of DIC'
    },
    {
        keyword: 'DILU',
        description: 'Diagonal Incomplete LU',
        category: 'preconditioner',
        documentation: 'Preconditioner for asymmetric matrices'
    },
    {
        keyword: 'diagonal',
        description: 'Diagonal preconditioner',
        category: 'preconditioner',
        documentation: 'Simplest preconditioner, scales by diagonal'
    },

    // ===== Smoothers =====
    {
        keyword: 'GaussSeidel',
        description: 'Gauss-Seidel smoother',
        category: 'smoother',
        documentation: 'Standard iterative smoother'
    },
    {
        keyword: 'symGaussSeidel',
        description: 'Symmetric Gauss-Seidel smoother',
        category: 'smoother',
        documentation: 'For symmetric matrices'
    },
    {
        keyword: 'DICGaussSeidel',
        description: 'DIC preconditioned Gauss-Seidel',
        category: 'smoother',
        documentation: 'More robust smoother with preconditioning'
    },
    {
        keyword: 'ILU',
        description: 'Incomplete LU smoother',
        category: 'smoother',
        documentation: 'For asymmetric matrices'
    },

    // ===== Solver Parameters =====
    {
        keyword: 'solver',
        description: 'Linear solver type',
        category: 'solverParameter',
        validValues: ['PCG', 'PBiCGStab', 'smoothSolver', 'GAMG', 'diagonal'],
        documentation: 'Specifies which linear solver to use'
    },
    {
        keyword: 'preconditioner',
        description: 'Preconditioner type',
        category: 'solverParameter',
        validValues: ['DIC', 'FDIC', 'DILU', 'diagonal', 'none'],
        documentation: 'Preconditioner for the linear solver'
    },
    {
        keyword: 'smoother',
        description: 'Smoother type (for smoothSolver/GAMG)',
        category: 'solverParameter',
        validValues: ['GaussSeidel', 'symGaussSeidel', 'DICGaussSeidel', 'ILU'],
        documentation: 'Smoother used in iterative process'
    },
    {
        keyword: 'tolerance',
        description: 'Absolute convergence tolerance',
        category: 'solverParameter',
        example: 'tolerance 1e-06;',
        documentation: 'Absolute residual below which solver stops'
    },
    {
        keyword: 'relTol',
        description: 'Relative convergence tolerance',
        category: 'solverParameter',
        example: 'relTol 0.01;',
        documentation: 'Relative reduction in residual (0.01 = 99% reduction)'
    },
    {
        keyword: 'minIter',
        description: 'Minimum number of iterations',
        category: 'solverParameter',
        example: 'minIter 1;',
        documentation: 'Solver performs at least this many iterations'
    },
    {
        keyword: 'maxIter',
        description: 'Maximum number of iterations',
        category: 'solverParameter',
        example: 'maxIter 1000;',
        documentation: 'Maximum iterations before solver gives up'
    },
    {
        keyword: 'nPreSweeps',
        description: 'Pre-smoothing sweeps (GAMG)',
        category: 'solverParameter',
        example: 'nPreSweeps 0;',
        documentation: 'Number of smoothing iterations before coarsening'
    },
    {
        keyword: 'nPostSweeps',
        description: 'Post-smoothing sweeps (GAMG)',
        category: 'solverParameter',
        example: 'nPostSweeps 2;',
        documentation: 'Number of smoothing iterations after coarsening'
    },
    {
        keyword: 'nFinestSweeps',
        description: 'Sweeps on finest level (GAMG)',
        category: 'solverParameter',
        example: 'nFinestSweeps 2;',
        documentation: 'Smoothing sweeps on original mesh level'
    },
    {
        keyword: 'cacheAgglomeration',
        description: 'Cache agglomeration (GAMG)',
        category: 'solverParameter',
        validValues: ['true', 'false', 'yes', 'no'],
        documentation: 'Whether to cache coarse level information'
    },
    {
        keyword: 'nCellsInCoarsestLevel',
        description: 'Coarsest level size (GAMG)',
        category: 'solverParameter',
        example: 'nCellsInCoarsestLevel 10;',
        documentation: 'Target number of cells in coarsest multigrid level'
    },
    {
        keyword: 'agglomerator',
        description: 'Agglomeration method (GAMG)',
        category: 'solverParameter',
        validValues: ['faceAreaPair', 'pairPatchAwareGAMGAgglomeration'],
        documentation: 'Method for creating coarse levels'
    },
    {
        keyword: 'mergeLevels',
        description: 'Merge level ratio (GAMG)',
        category: 'solverParameter',
        example: 'mergeLevels 1;',
        documentation: 'Ratio for merging multigrid levels'
    },

    // ===== Function Objects =====
    {
        keyword: 'type',
        description: 'Function object or boundary condition type',
        category: 'function',
        documentation: 'Specifies the type of function object or BC'
    },
    {
        keyword: 'probes',
        description: 'Sample field values at points',
        category: 'functionType',
        documentation: 'Function object to monitor values at specific locations'
    },
    {
        keyword: 'forces',
        description: 'Calculate forces and moments',
        category: 'functionType',
        documentation: 'Computes forces and moments on patches'
    },
    {
        keyword: 'forceCoeffs',
        description: 'Calculate force coefficients',
        category: 'functionType',
        documentation: 'Computes dimensionless force coefficients (Cd, Cl, Cm)'
    },
    {
        keyword: 'fieldAverage',
        description: 'Time-average fields',
        category: 'functionType',
        documentation: 'Computes time-averaged and RMS fields'
    },
    {
        keyword: 'yPlus',
        description: 'Calculate y+ values',
        category: 'functionType',
        documentation: 'Computes y+ at walls for turbulence modeling'
    },
    {
        keyword: 'wallShearStress',
        description: 'Calculate wall shear stress',
        category: 'functionType',
        documentation: 'Computes shear stress at wall boundaries'
    },
    {
        keyword: 'Q',
        description: 'Calculate Q-criterion',
        category: 'functionType',
        documentation: 'Vortex identification using Q-criterion'
    },
    {
        keyword: 'vorticity',
        description: 'Calculate vorticity field',
        category: 'functionType',
        documentation: 'Computes vorticity (curl of velocity)'
    },

    // ===== Boundary Condition Types =====
    {
        keyword: 'fixedValue',
        description: 'Fixed Dirichlet boundary condition',
        category: 'boundaryCondition',
        example: 'type fixedValue;\nvalue uniform (1 0 0);',
        documentation: 'Sets a fixed value at the boundary'
    },
    {
        keyword: 'zeroGradient',
        description: 'Zero normal gradient boundary condition',
        category: 'boundaryCondition',
        documentation: 'Sets zero gradient in normal direction (Neumann BC)'
    },
    {
        keyword: 'calculated',
        description: 'Calculated from other fields',
        category: 'boundaryCondition',
        documentation: 'Value is calculated, not prescribed'
    },
    {
        keyword: 'slip',
        description: 'Free-slip boundary condition',
        category: 'boundaryCondition',
        documentation: 'Zero normal component, zero normal gradient of tangential'
    },
    {
        keyword: 'symmetryPlane',
        description: 'Symmetry plane boundary',
        category: 'boundaryCondition',
        documentation: 'Enforces symmetry conditions'
    },
    {
        keyword: 'empty',
        description: 'Empty boundary for 2D cases',
        category: 'boundaryCondition',
        documentation: 'Used for front and back faces in 2D simulations'
    },
    {
        keyword: 'wedge',
        description: 'Wedge boundary for axisymmetric cases',
        category: 'boundaryCondition',
        documentation: 'Used for axisymmetric simulations'
    },
    {
        keyword: 'cyclic',
        description: 'Cyclic/periodic boundary condition',
        category: 'boundaryCondition',
        documentation: 'Couples opposite boundaries for periodic flow'
    },
    {
        keyword: 'inletOutlet',
        description: 'Inlet/outlet boundary condition',
        category: 'boundaryCondition',
        documentation: 'Acts as inlet or outlet depending on flow direction'
    },
    {
        keyword: 'turbulentIntensityKineticEnergyInlet',
        description: 'Turbulent kinetic energy from intensity',
        category: 'boundaryCondition',
        documentation: 'Calculates k from turbulent intensity'
    },

    // ===== FoamFile Header =====
    {
        keyword: 'FoamFile',
        description: 'OpenFOAM file header',
        category: 'header',
        documentation: 'Required header dictionary for all OpenFOAM files'
    },
    {
        keyword: 'version',
        description: 'OpenFOAM version',
        category: 'header',
        example: 'version 2.0;',
        documentation: 'OpenFOAM version (typically 2.0)'
    },
    {
        keyword: 'format',
        description: 'File format',
        category: 'header',
        validValues: ['ascii', 'binary'],
        example: 'format ascii;',
        documentation: 'Whether file is ASCII or binary'
    },
    {
        keyword: 'class',
        description: 'File class/type',
        category: 'header',
        example: 'class dictionary;',
        validValues: ['dictionary', 'volScalarField', 'volVectorField', 'surfaceScalarField'],
        documentation: 'Type of data in the file'
    },
    {
        keyword: 'location',
        description: 'File location',
        category: 'header',
        example: 'location "system";',
        documentation: 'Path relative to case directory'
    },
    {
        keyword: 'object',
        description: 'Object name',
        category: 'header',
        example: 'object controlDict;',
        documentation: 'Name of the dictionary/object'
    }
];

// Helper function to get keywords by category
export function getKeywordsByCategory(category: string): KeywordInfo[] {
    return OPENFOAM_KEYWORDS.filter(kw => kw.category === category);
}

// Helper function to find keyword info
export function findKeyword(keyword: string): KeywordInfo | undefined {
    return OPENFOAM_KEYWORDS.find(kw => kw.keyword === keyword);
}

// Get all unique categories
export function getCategories(): string[] {
    const categories = new Set(OPENFOAM_KEYWORDS.map(kw => kw.category));
    return Array.from(categories);
}
