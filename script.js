/* ============================================
   Resume Ranking System - JavaScript Logic
   ============================================ */

// ---------- DOM Elements ----------
const themeToggle = document.getElementById('themeToggle');
const landing = document.getElementById('landing');
const appSection = document.getElementById('appSection');
const startBtn = document.getElementById('startBtn');
const backToLanding = document.getElementById('backToLanding');

const uploadPanel = document.getElementById('uploadPanel');
const jobDescPanel = document.getElementById('jobDescPanel');
const resultsPanel = document.getElementById('resultsPanel');

const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const toJobDescBtn = document.getElementById('toJobDescBtn');

const jobDescInput = document.getElementById('jobDescInput');
const charCount = document.getElementById('charCount');
const backToUploadBtn = document.getElementById('backToUploadBtn');
const analyzeBtn = document.getElementById('analyzeBtn');

const loadingOverlay = document.getElementById('loadingOverlay');
const loadingSubtext = document.getElementById('loadingSubtext');
const progressBar = document.getElementById('progressBar');
const progressLabel = document.getElementById('progressLabel');

const resultsSummary = document.getElementById('resultsSummary');
const resultsGrid = document.getElementById('resultsGrid');
const startOverBtn = document.getElementById('startOverBtn');

// ---------- State ----------
let uploadedFiles = []; // { name, content, size }
let analysisData = null; // Stores data for DSA visualizer

// ---------- Tech Dictionary (Whitelist for Keyword Extraction) ----------
const TECH_DICTIONARY = new Set([
    // Languages
    'javascript', 'js', 'python', 'java', 'c++', 'cpp', 'c#', 'csharp', 'c', 'ruby', 'go', 'golang', 'rust', 'swift', 'kotlin', 'php', 'typescript', 'ts', 'scala', 'dart', 'r', 'sql', 'nosql', 'html', 'css', 'bash', 'shell', 'solidity', 'assembly', 'perl', 'lua', 'haskell', 'clojure', 'elixir', 'erlang', 'f#', 'objective-c', 'vb.net', 'matlab', 'groovy',
    // Frameworks & Libraries
    'react', 'reactjs', 'react.js', 'angular', 'angularjs', 'vue', 'vuejs', 'vue.js', 'node', 'nodejs', 'node.js', 'express', 'expressjs', 'django', 'flask', 'fastapi', 'spring', 'springboot', 'spring-boot', 'rails', 'ruby-on-rails', 'laravel', 'asp.net', '.net', 'nextjs', 'next.js', 'nuxt', 'nuxtjs', 'svelte', 'sveltekit', 'bootstrap', 'tailwind', 'tailwindcss', 'jquery', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'opencv', 'hadoop', 'spark', 'kafka', 'rabbitmq', 'celery', 'redis', 'memcached', 'graphql', 'apollo', 'redux', 'mobx', 'rxjs', 'd3', 'threejs', 'webgl', 'socket.io', 'webrtc', 'electron', 'flutter', 'react-native', 'ionic', 'xamarin', 'unity', 'unreal', 'godot',
    // Databases
    'mysql', 'postgres', 'postgresql', 'mongodb', 'mongo', 'sqlite', 'cassandra', 'oracle', 'mariadb', 'dynamodb', 'elasticsearch', 'couchbase', 'couchdb', 'neo4j', 'redis', 'firebase', 'supabase', 'snowflake', 'redshift', 'bigquery', 'graphql', 'sql-server', 'mssql', 'db2',
    // Cloud & DevOps
    'aws', 'amazon-web-services', 'azure', 'gcp', 'google-cloud', 'docker', 'kubernetes', 'k8s', 'jenkins', 'gitlab', 'github', 'bitbucket', 'ci/cd', 'terraform', 'ansible', 'chef', 'puppet', 'vagrant', 'nginx', 'apache', 'linux', 'unix', 'ubuntu', 'centos', 'debian', 'alpine', 'windows', 'macos', 'bash', 'powershell', 'prometheus', 'grafana', 'datadog', 'new-relic', 'splunk', 'elk', 'fluentd', 'logstash', 'kibana', 'istio', 'envoy', 'consul', 'vault', 'travis-ci', 'circleci', 'bamboo', 'argocd', 'flux', 'helm',
    // Tools & Platforms
    'git', 'svn', 'mercurial', 'jira', 'confluence', 'trello', 'asana', 'figma', 'sketch', 'adobe', 'photoshop', 'illustrator', 'postman', 'swagger', 'openapi', 'rest', 'restful', 'api', 'soap', 'grpc', 'graphql', 'websocket', 'oauth', 'jwt', 'saml', 'sso', 'npm', 'yarn', 'pnpm', 'webpack', 'babel', 'vite', 'parcel', 'rollup', 'gulp', 'grunt', 'maven', 'gradle', 'ant', 'sbt', 'nuget', 'pip', 'conda', 'poetry', 'composer', 'cargo',
    // Concepts & Methodologies
    'agile', 'scrum', 'kanban', 'lean', 'waterfall', 'oop', 'fp', 'mvc', 'mvvm', 'microservices', 'monolith', 'serverless', 'tdd', 'bdd', 'ddd', 'machine-learning', 'ml', 'ai', 'artificial-intelligence', 'data-science', 'blockchain', 'web3', 'smart-contracts', 'ui', 'ux', 'ui/ux', 'frontend', 'front-end', 'backend', 'back-end', 'fullstack', 'full-stack', 'qa', 'testing', 'automation', 'devops', 'devsecops', 'sre', 'finops', 'sysadmin', 'dba', 'seo', 'accessibility', 'a11y', 'i18n', 'l10n', 'performance', 'optimization', 'security', 'cryptography', 'encryption', 'hashing', 'algorithms', 'data-structures', 'system-design', 'architecture', 'scalability', 'high-availability', 'fault-tolerance', 'concurrency', 'multithreading', 'asynchronous', 'reactive', 'event-driven'
]);

// ===========================================
//  Theme Toggle
// ===========================================
themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
});

// ===========================================
//  Mobile Nav Menu
// ===========================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    // Close mobile menu on any link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
        });
    });
}

// Nav "How it Works" link opens the modal
const navHowItWorks = document.getElementById('navHowItWorks');
if (navHowItWorks) {
    navHowItWorks.addEventListener('click', (e) => {
        e.preventDefault();
        const howModal = document.getElementById('howItWorksModal');
        if (howModal) howModal.classList.remove('hidden');
    });
}

// ===========================================
//  Navigation
// ===========================================
startBtn.addEventListener('click', () => {
    landing.style.display = 'none';
    appSection.classList.add('active');
    showPanel('upload');
});

backToLanding.addEventListener('click', () => {
    appSection.classList.remove('active');
    landing.style.display = 'flex';
});

toJobDescBtn.addEventListener('click', () => showPanel('jobDesc'));

backToUploadBtn.addEventListener('click', () => showPanel('upload'));

startOverBtn.addEventListener('click', () => {
    uploadedFiles = [];
    fileList.innerHTML = '';
    jobDescInput.value = '';
    charCount.textContent = '0';
    toJobDescBtn.disabled = true;
    analyzeBtn.disabled = true;
    resultsGrid.innerHTML = '';
    resultsSummary.innerHTML = '';
    showPanel('upload');
});

function showPanel(panel) {
    uploadPanel.classList.add('hidden');
    jobDescPanel.classList.add('hidden');
    resultsPanel.classList.add('hidden');

    const steps = document.querySelectorAll('.step');
    const lines = document.querySelectorAll('.step-line');

    steps.forEach(s => { s.classList.remove('active', 'completed'); });
    lines.forEach(l => { l.classList.remove('active'); });

    if (panel === 'upload') {
        uploadPanel.classList.remove('hidden');
        steps[0].classList.add('active');
    } else if (panel === 'jobDesc') {
        jobDescPanel.classList.remove('hidden');
        steps[0].classList.add('completed');
        lines[0].classList.add('active');
        steps[1].classList.add('active');
    } else if (panel === 'results') {
        resultsPanel.classList.remove('hidden');
        steps[0].classList.add('completed');
        steps[1].classList.add('completed');
        lines[0].classList.add('active');
        lines[1].classList.add('active');
        steps[2].classList.add('active');
    }
}

// ===========================================
//  File Upload (Drag & Drop + Click)
// ===========================================
dropzone.addEventListener('click', () => fileInput.click());

dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('drag-over');
});

dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('drag-over');
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-over');
    handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', () => {
    handleFiles(fileInput.files);
    fileInput.value = '';
});

async function extractTextFromPDF(file) {
    const fileUrl = URL.createObjectURL(file);
    try {
        const pdf = await pdfjsLib.getDocument(fileUrl).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + ' ';
        }
        return fullText;
    } finally {
        URL.revokeObjectURL(fileUrl);
    }
}

async function extractTextFromDocx(file) {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    return result.value;
}

async function handleFiles(files) {
    const allowedFiles = Array.from(files).filter(f => f.name.endsWith('.txt') || f.name.endsWith('.pdf') || f.name.endsWith('.docx'));
    if (allowedFiles.length === 0) return;

    for (const file of allowedFiles) {
        // Avoid duplicates
        if (uploadedFiles.find(f => f.name === file.name)) continue;

        if (file.name.endsWith('.pdf')) {
            try {
                const text = await extractTextFromPDF(file);
                uploadedFiles.push({
                    name: file.name,
                    content: text,
                    size: file.size
                });
                renderFileList();
                toJobDescBtn.disabled = uploadedFiles.length === 0;
            } catch (err) {
                console.error('Error reading PDF:', err);
                alert(`Failed to read PDF: ${file.name}`);
            }
        } else if (file.name.endsWith('.docx')) {
            try {
                const text = await extractTextFromDocx(file);
                uploadedFiles.push({
                    name: file.name,
                    content: text,
                    size: file.size
                });
                renderFileList();
                toJobDescBtn.disabled = uploadedFiles.length === 0;
            } catch (err) {
                console.error('Error reading DOCX:', err);
                alert(`Failed to read DOCX: ${file.name}`);
            }
        } else {
            // It's a .txt file
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedFiles.push({
                    name: file.name,
                    content: e.target.result,
                    size: file.size
                });
                renderFileList();
                toJobDescBtn.disabled = uploadedFiles.length === 0;
            };
            reader.readAsText(file);
        }
    }
}

function renderFileList() {
    fileList.innerHTML = uploadedFiles.map((file, index) => `
        <div class="file-chip" style="animation-delay: ${index * 0.05}s">
            <div class="file-chip-icon">📄</div>
            <div class="file-name">${escapeHtml(file.name)} <span style="font-size:0.85em;opacity:0.6;margin-left:6px;font-weight:400;">${formatSize(file.size)}</span></div>
            <button class="file-chip-remove" onclick="removeFile(${index})" aria-label="Remove">✕</button>
        </div>
    `).join('');
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    renderFileList();
    toJobDescBtn.disabled = uploadedFiles.length === 0;
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    return (bytes / 1024).toFixed(1) + ' KB';
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ===========================================
//  Job Description
// ===========================================
jobDescInput.addEventListener('input', () => {
    charCount.textContent = jobDescInput.value.length;
    analyzeBtn.disabled = jobDescInput.value.trim().length < 10;
});

// ===========================================
//  Analyze & Rank
// ===========================================
analyzeBtn.addEventListener('click', startAnalysis);

async function startAnalysis() {
    analyzeBtn.classList.add('analyzing');
    const btnText = analyzeBtn.querySelector('.btn-text');
    if (btnText) btnText.textContent = 'Analyzing...';

    loadingOverlay.classList.remove('hidden');
    const phases = [
        { text: 'Extracting keywords from job description...', pct: 15 },
        { text: 'Preprocessing resume content...', pct: 35 },
        { text: 'Building word frequency maps...', pct: 55 },
        { text: 'Calculating matching scores...', pct: 75 },
        { text: 'Ranking candidates...', pct: 90 },
        { text: 'Finalizing results...', pct: 100 }
    ];

    for (const phase of phases) {
        loadingSubtext.textContent = phase.text;
        progressBar.style.width = phase.pct + '%';
        progressLabel.textContent = phase.pct + '%';
        await sleep(400 + Math.random() * 300);
    }

    const results = rankResumes(jobDescInput.value, uploadedFiles);
    await sleep(300);
    loadingOverlay.classList.add('hidden');
    progressBar.style.width = '0%';
    progressLabel.textContent = '0%';

    analyzeBtn.classList.remove('analyzing');
    const btnTextEnd = analyzeBtn.querySelector('.btn-text');
    if (btnTextEnd) btnTextEnd.textContent = 'Scan & Rank Resumes';

    displayResults(results);
    showPanel('results');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ===========================================
//  Ranking Algorithm
// ===========================================

/**
 * Tokenize text: lowercase, remove non-alpha, split, remove stop words.
 * Returns an array of clean words.
 */
function tokenize(text) {
    return text
        .toLowerCase()
        // we keep hyphens inside words (e.g. react-native, front-end) but replace other punctuation
        .replace(/[^\w\s-]/g, ' ')
        .split(/\s+/)
        // only keep words that exactly exist in our TECH_DICTIONARY
        .filter(word => word.length > 1 && TECH_DICTIONARY.has(word));
}

/**
 * Build a word frequency hashmap from an array of words.
 */
function buildFrequencyMap(words) {
    const freq = {};
    for (const word of words) {
        freq[word] = (freq[word] || 0) + 1;
    }
    return freq;
}

/**
 * Rank resumes against the job description using TF-IDF.
 * Returns sorted array of { name, score, matchedKeywords, totalKeywords }.
 */
function rankResumes(jobDesc, resumes) {
    // 1. Job Description processing
    const jdWords = tokenize(jobDesc);
    const jdFreq = buildFrequencyMap(jdWords); // Hash Map O(N)
    
    // Sort JD keywords by frequency to determine importance
    const jdKeywords = Object.entries(jdFreq)
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);

    const totalKeywords = jdKeywords.length;
    const totalDocs = resumes.length;

    // 2. Build Document Frequencies (in how many resumes does a word appear?)
    const docFreq = {};
    const resumeFreqMaps = []; // Store TF maps for each candidate

    resumes.forEach((resume, idx) => {
        const words = tokenize(resume.content);
        const freqMap = buildFrequencyMap(words);
        resumeFreqMaps.push({ name: resume.name.replace(/\.(txt|pdf|docx)$/i, ''), map: freqMap });

        // Count for IDF
        const uniqueWords = new Set(words);
        for (const word of uniqueWords) {
            docFreq[word] = (docFreq[word] || 0) + 1;
        }
    });

    // 3. Calculate IDF for each keyword
    const idfMap = {};
    for (const keyword of jdKeywords) {
        // formula: Math.log10(Total Docs / Docs Containing Keyword)
        // using N+1 to avoid precision issues
        const docsWithTerm = docFreq[keyword] || 0;
        idfMap[keyword] = Math.max(0.1, Math.log10((totalDocs + 1) / (docsWithTerm + 1))); 
    }

    // Save for visualizer
    analysisData = {
        jdFreq,
        jdKeywords,
        idfMap,
        candidates: [],
        theoreticalMax: 0
    };

    // 4a. Calculate Theoretical Max Score (JD vs itself = perfect resume)
    //     If a resume had every JD keyword at the same frequency as the JD:
    //     theoreticalMax = Σ jdFreq[keyword] * idf[keyword] * jdFreq[keyword]
    let theoreticalMax = 0;
    for (const keyword of jdKeywords) {
        theoreticalMax += jdFreq[keyword] * idfMap[keyword] * jdFreq[keyword];
    }
    analysisData.theoreticalMax = theoreticalMax;
    
    const results = resumeFreqMaps.map((candidate, idx) => {
        let rawScore = 0;
        const matchedKeywords = [];
        const missingSkills = []; // Track missing skills
        const keywordStats = []; // For tables

        for (const keyword of jdKeywords) {
            const jdCount = jdFreq[keyword];
            const resumeCount = candidate.map[keyword] || 0;
            const idf = idfMap[keyword];
            
            if (resumeCount > 0) {
                // TF: term frequency in resume
                // Can normalize by log: 1 + Math.log10(resumeCount)
                const tf = resumeCount; 
                
                // Weight based on importance in Job Description as well
                const termScore = tf * idf * jdCount;
                rawScore += termScore;
                
                matchedKeywords.push(keyword);
                
                keywordStats.push({
                    keyword,
                    jdCount,
                    resumeCount,
                    tf,
                    idf: idf.toFixed(3),
                    score: termScore.toFixed(2)
                });
            } else {
                // Not found in resume
                missingSkills.push({
                    keyword,
                    potentialScore: idf * jdCount * 1 // Assessing TF-IDF impact if added once
                });
                
                keywordStats.push({
                    keyword,
                    jdCount,
                    resumeCount: 0,
                    tf: 0,
                    idf: idfMap[keyword].toFixed(3),
                    score: "0.00"
                });
            }
        }
        
        // Sort missing skills by potential impact descending
        missingSkills.sort((a, b) => b.potentialScore - a.potentialScore);
        const suggestedSkills = missingSkills.map(s => s.keyword);

        const resultObj = {
            name: candidate.name,
            rawScore,
            matchedKeywords,
            suggestedSkills,
            totalKeywords,
            keywordStats,
            map: candidate.map
        };
        analysisData.candidates.push(resultObj);

        return resultObj;
    });

    // 5. Normalize scores against theoretical max (absolute JD match, not relative)
    results.forEach(res => {
        if (theoreticalMax === 0) {
            res.score = 0;
        } else {
            // Absolute match: how well does this resume match the JD?
            res.score = Math.min(100, Math.round((res.rawScore / theoreticalMax) * 100));
        }
    });

    // Sort descending
    results.sort((a, b) => b.score - a.score);
    // Sort analysis data matching the results to display in same order
    analysisData.candidates.sort((a, b) => b.score - a.score);

    return results;
}

// ===========================================
//  Display Results
// ===========================================
function displayResults(results) {
    const topScore = results.length > 0 ? results[0].score : 0;
    const avgScore = results.length > 0
        ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
        : 0;

    // Summary cards
    resultsSummary.innerHTML = `
        <div class="summary-card">
            <span class="value counter-value" data-target="${results.length}">0</span>
            <span class="label">Candidates</span>
        </div>
        <div class="summary-card">
            <span class="value counter-value" data-target="${topScore}">0</span><span style="font-size:1.4rem; font-weight:800; color:#0084FF">%</span>
            <span class="label">Top Score</span>
        </div>
        <div class="summary-card">
            <span class="value counter-value" data-target="${avgScore}">0</span><span style="font-size:1.4rem; font-weight:800; color:#0084FF">%</span>
            <span class="label">Avg Score</span>
        </div>
    `;

    // Result cards
    resultsGrid.innerHTML = results.map((result, index) => {
        const crown = index === 0 ? '<span class="crown">👑</span>' : '';
        const delay = index * 0.05 + 0.1; // staggered entrance

        const keywordTags = result.matchedKeywords.slice(0, 12).map(kw =>
            `<span class="keyword-tag matched">${escapeHtml(kw)}</span>`
        ).join('');

        const unmatchedCount = result.totalKeywords - result.matchedKeywords.length;
        const moreTag = unmatchedCount > 0
            ? `<span class="keyword-tag">+${unmatchedCount} unmatched</span>`
            : '';

        const coveragePct = result.totalKeywords > 0
            ? Math.round((result.matchedKeywords.length / result.totalKeywords) * 100)
            : 0;

        let chanceHtml = '';
        
        const successMsgs = [
            "Excellent fit! High chance of scoring an interview.",
            "Top-tier match! Their skills perfectly align with the role.",
            "Standout candidate! Highly recommended for an immediate interview.",
            "Exceptional alignment! They have the exact experience needed."
        ];
        
        const accentMsgs = [
            "Solid foundation. A few core skills away from being a top candidate.",
            "Good potential! Strong match, but missing some secondary skills.",
            "Strong contender. They have most of the requirements covered.",
            "Promising profile! Worth a closer look for this position."
        ];
        
        const warningMsgs = [
            "Keep building! Focus on acquiring these key missing skills.",
            "Needs more experience in the core technologies required.",
            "A bit of a stretch. Might be better suited for a junior role.",
            "Lacking key alignments. Consider focusing on the missing keywords."
        ];
        
        if (result.score >= 65) {
            const msg = successMsgs[Math.floor(Math.random() * successMsgs.length)];
            chanceHtml = `
                <div class="chance-pill chance-pill-success">
                    <span class="chance-icon">🎯</span>
                    ${msg}
                </div>
            `;
        } else if (result.score >= 40) {
            const msg = accentMsgs[Math.floor(Math.random() * accentMsgs.length)];
            chanceHtml = `
                <div class="chance-pill chance-pill-accent">
                    <span class="chance-icon">✨</span>
                    ${msg}
                </div>
            `;
        } else {
            const msg = warningMsgs[Math.floor(Math.random() * warningMsgs.length)];
            chanceHtml = `
                <div class="chance-pill chance-pill-warning">
                    <span class="chance-icon">💪</span>
                    ${msg}
                </div>
            `;
        }

        return `
            <div class="result-card" style="animation-delay: ${delay}s">
                <div class="result-rank">${index + 1}</div>
                <div class="result-body">
                    <div class="result-name">${escapeHtml(result.name)} ${crown}</div>
                    
                    <div class="result-score-bar">
                        <div class="score-track">
                            <div class="score-fill" style="width: 0%" data-target="${result.score}"></div>
                        </div>
                        <div class="score-text-group">
                            <div style="display:flex; align-items:baseline;">
                                <span class="score-value counter-value" data-target="${result.score}">0</span><span class="score-value" style="font-size: 1rem; margin-left:2px;">%</span>
                            </div>
                            <div style="display:flex; flex-direction:column; align-items:flex-end; gap:2px; margin-top:2px;">
                                <span class="score-match" style="margin-top:0;">Raw TF-IDF: <strong style="color:var(--text-primary); font-family:monospace;">${result.rawScore.toFixed(2)}</strong></span>
                                <span class="score-match" style="margin-top:0;">${result.matchedKeywords.length}/${result.totalKeywords} Keywords</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="result-keywords">
                        ${keywordTags}
                        ${moreTag}
                    </div>
                    
                    ${result.suggestedSkills && result.suggestedSkills.length > 0 ? `
                        <div class="result-suggestions" style="margin-top: 14px; padding-left: 72px;">
                            <span style="font-size: 0.8rem; font-weight: 600; color: #9999aa; display: block; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">🔥 High-Impact Skills to Add:</span>
                            <div style="display:flex; flex-wrap:wrap; gap:8px;">
                                ${result.suggestedSkills.slice(0, 4).map(kw => `<span class="keyword-tag" style="border-color: rgba(0, 132, 255, 0.4); color: #0084FF; background: rgba(0, 132, 255, 0.05); cursor: help;" title="Adding this skill significantly boosts JD alignment">+ ${escapeHtml(kw)}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${chanceHtml}
                </div>
            </div>
        `;
    }).join('');

    // Animate score bars and counters after render
    requestAnimationFrame(() => {
        setTimeout(() => {
            // Animate progress bars
            document.querySelectorAll('.score-fill').forEach(bar => {
                bar.style.width = bar.dataset.target + '%';
            });
            
            // Animate number counters
            document.querySelectorAll('.counter-value').forEach(counter => {
                const target = +counter.dataset.target;
                const duration = 1500;
                const startTime = performance.now();
                
                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // easeOutQuart
                    const ease = 1 - Math.pow(1 - progress, 4);
                    
                    counter.textContent = Math.round(target * ease);
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target; // Ensure exact final value
                    }
                }
                requestAnimationFrame(updateCounter);
            });
        }, 100);
    });
}

// ===========================================
//  DSA Visualizer Modal Logic
// ===========================================
const dsaModal = document.getElementById('dsaModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const viewDsaBtn = document.getElementById('viewDsaBtn');
const jdHashmap = document.getElementById('jdHashmap');
const candidateSelect = document.getElementById('candidateSelect');
const candidateHashmap = document.getElementById('candidateHashmap');
const tfidfTableBody = document.getElementById('tfidfTableBody');
const candidateScoreSummary = document.getElementById('candidateScoreSummary');

// How it Works Modal
const howItWorksModal = document.getElementById('howItWorksModal');
const howItWorksBtn = document.getElementById('howItWorksBtn');
const closeHowItWorksBtn = document.getElementById('closeHowItWorksBtn');

howItWorksBtn.addEventListener('click', () => {
    howItWorksModal.classList.remove('hidden');
});

closeHowItWorksBtn.addEventListener('click', () => {
    howItWorksModal.classList.add('hidden');
});

howItWorksModal.addEventListener('click', (e) => {
    if (e.target === howItWorksModal) {
        howItWorksModal.classList.add('hidden');
    }
});

if (viewDsaBtn) {
    viewDsaBtn.addEventListener('click', () => {
        if (!analysisData) return;
        populateDsaModal();
        dsaModal.classList.remove('hidden');
    });
}

closeModalBtn.addEventListener('click', () => {
    dsaModal.classList.add('hidden');
});

// Close when clicking outside modal context
dsaModal.addEventListener('click', (e) => {
    if (e.target === dsaModal) {
        dsaModal.classList.add('hidden');
    }
});

candidateSelect.addEventListener('change', (e) => {
    const selectedIdx = parseInt(e.target.value);
    renderCandidateDsa(analysisData.candidates[selectedIdx]);
});

function populateDsaModal() {
    // 1. Render JD Hash Map
    const jdKeywords = analysisData.jdKeywords.slice(0, 30); // limit to top 30 for visualization
    jdHashmap.innerHTML = jdKeywords.map(kw => `
        <div class="hash-bucket">
            <div class="hash-key">${kw}</div>
            <div class="hash-value">${analysisData.jdFreq[kw]}</div>
        </div>
    `).join('');

    // 2. Populate Dropdown
    candidateSelect.innerHTML = analysisData.candidates.map((cand, idx) => 
        `<option value="${idx}">${cand.name}</option>`
    ).join('');

    // 3. Render first candidate by default
    if (analysisData.candidates.length > 0) {
        renderCandidateDsa(analysisData.candidates[0]);
    }

    // 4. Populate Worked Example
    populateWorkedExample();
}

function populateWorkedExample() {
    const exampleDiv = document.getElementById('workedExample');
    if (!analysisData || analysisData.candidates.length === 0) {
        exampleDiv.innerHTML = `<p class="example-placeholder">Run an analysis to see a live worked example with your data.</p>`;
        return;
    }

    const candidate = analysisData.candidates[0]; // top-scoring candidate
    const totalResumes = analysisData.candidates.length;
    const theoMax = analysisData.theoreticalMax;

    // Pick the top 5 matched keywords for the example
    const topStats = candidate.keywordStats
        .filter(s => s.resumeCount > 0)
        .sort((a, b) => parseFloat(b.score) - parseFloat(a.score))
        .slice(0, 5);

    const keywordRows = topStats.map(s => `
        <tr>
            <td style="font-weight:600; color: var(--text-primary);">${s.keyword}</td>
            <td>${s.resumeCount}</td>
            <td>${s.idf}</td>
            <td>${s.jdCount}</td>
            <td style="color: var(--success); font-weight:600;">${s.score}</td>
        </tr>
    `).join('');

    const remainingMatched = candidate.matchedKeywords.length - topStats.length;
    const remainingNote = remainingMatched > 0
        ? `<div class="example-row"><span class="example-label" style="font-style:italic;">+ ${remainingMatched} more matched keywords...</span></div>`
        : '';

    const coveragePct = candidate.totalKeywords > 0
        ? Math.round((candidate.matchedKeywords.length / candidate.totalKeywords) * 100)
        : 0;

    exampleDiv.innerHTML = `
        <div class="example-heading">Candidate: ${escapeHtml(candidate.name)}</div>
        <div class="example-row">
            <span class="example-label">Total Resumes (N)</span>
            <span class="example-value">${totalResumes}</span>
        </div>
        <div class="example-row">
            <span class="example-label">JD Keywords Extracted</span>
            <span class="example-value">${candidate.totalKeywords}</span>
        </div>
        <div class="example-row">
            <span class="example-label">Keywords Matched</span>
            <span class="example-value accent">${candidate.matchedKeywords.length} / ${candidate.totalKeywords} (${coveragePct}% coverage)</span>
        </div>

        <div class="example-heading">Top Keyword Scores (TF × IDF × JD_Freq)</div>
        <table class="example-keyword-table">
            <thead>
                <tr>
                    <th>Keyword</th>
                    <th>TF</th>
                    <th>IDF</th>
                    <th>JD Freq</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>${keywordRows}</tbody>
        </table>
        ${remainingNote}

        <div class="example-heading">Final Calculation</div>
        <div class="example-row">
            <span class="example-label">Raw Score (Σ all terms)</span>
            <span class="example-value accent">${candidate.rawScore.toFixed(2)}</span>
        </div>
        <div class="example-row">
            <span class="example-label">Theoretical Max (JD vs JD)</span>
            <span class="example-value">${theoMax.toFixed(2)}</span>
        </div>
        <div class="example-row example-final">
            <span class="example-label">JD Match = (${candidate.rawScore.toFixed(2)} / ${theoMax.toFixed(2)}) × 100</span>
            <span class="example-value success">${candidate.score}%</span>
        </div>
    `;
}

function renderCandidateDsa(candidate) {
    // 1. Render Candidate Hash Map (Only matching keywords for visual clarity)
    const matchingKeys = candidate.matchedKeywords.slice(0, 30);
    if (matchingKeys.length === 0) {
        candidateHashmap.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">No matching keywords found in hash map.</p>`;
    } else {
        candidateHashmap.innerHTML = matchingKeys.map(kw => `
            <div class="hash-bucket">
                <div class="hash-key">${kw}</div>
                <div class="hash-value">${candidate.map[kw]}</div>
            </div>
        `).join('');
    }

    // 2. Render TF-IDF Table
    tfidfTableBody.innerHTML = candidate.keywordStats.map(stat => {
        const isMatch = stat.resumeCount > 0;
        return `
            <tr class="${isMatch ? 'match-row' : ''}">
                <td style="font-weight: 600;">${stat.keyword}</td>
                <td>${stat.jdCount}</td>
                <td>${stat.resumeCount}</td>
                <td class="mono-num">${stat.tf}</td>
                <td class="mono-num">${stat.idf}</td>
                <td class="mono-num" style="color: ${isMatch ? 'var(--success)' : 'var(--text-muted)'}">${stat.score}</td>
            </tr>
        `;
    }).join('');

    // 3. Render Score Summary
    candidateScoreSummary.innerHTML = `
        <span>Raw TF-IDF Sum: <span style="color: var(--text-primary); margin-left:8px;">${candidate.rawScore.toFixed(2)}</span></span>
        <span style="color: var(--accent-light);">Final Normalized Score: ${candidate.score}%</span>
    `;
}
