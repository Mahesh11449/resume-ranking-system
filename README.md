# AI Resume Ranking System

<div align="center">
  <p>A smart, browser-based resume screening tool that ranks candidates against job descriptions using intelligent keyword matching and TF-IDF scoring.</p>
</div>

## 🌟 Overview

The **AI Resume Ranking System** is designed to streamline the recruitment process. It allows recruiters and hiring managers to effortlessly analyze multiple resumes (.txt, .pdf, .docx) against a specific job description. By employing a robust keyword matching algorithm and mathematical weighting (TF-IDF), the system provides an objective and absolute percentage score representing how well each candidate matches the job requirements.

The interface features a modern, premium **Liquid Glass** aesthetic with smooth animations and dynamic data visualization, ensuring an engaging user experience.

## ✨ Key Features

- **Multi-format Resume Upload**: Seamlessly drag and drop `.pdf`, `.docx`, and `.txt` files.
- **Job Description Parsing**: Paste your target job description, and the system instantly extracts core keywords.
- **Intelligent Scoring (TF-IDF)**: Calculates a true JD Match Percentage based on term frequency and rarity across candidates.
- **Ranking Dashboard**: View candidates sorted from highest to lowest match score, complete with badges for top candidates and keyword coverage analysis.
- **Algorithm Visualizer (DSA)**: An interactive modal that breaks down exactly how the scoring works, displaying Hash Maps, Term Frequencies, and Inverse Document Frequencies in a transparent way.
- **Premium UI/UX**: A dark-themed, glassmorphic design built with vanilla HTML, CSS, and interactive JavaScript.

## 🛠️ Technology Stack

- **Frontend Core**: HTML5, CSS3 (Vanilla), JavaScript (ES6+)
- **UI Design**: Custom Glassmorphism ("Liquid Glass" aesthetic)
- **Document Processing**:
  - `pdf.js` for client-side PDF parsing
  - `mammoth.js` for client-side DOCX parsing

## 🧠 Methodology & Algorithm

The system moves away from simple keyword counting to provide a mathematically sound ranking:

1. **Tokenization & Stop Words**: Resumes and JD are cleaned, lowercased, and filtered to remove common filler words.
2. **Hash Maps (Term Frequency - TF)**: Uses O(N) time complexity to build frequency maps counting keyword occurrences.
3. **Inverse Document Frequency (IDF)**: Computes a global weight to prioritize rare, highly specific skills over generic terms.
4. **Scoring**: Calculates a raw score for each candidate and normalizes it against a "theoretical perfect candidate" vector to yield a 0–100% **JD Match Score**.

## 🚀 Getting Started

Since the entire application runs locally in your browser, no complex server setup or build step is required!

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- Internet connection (to load the CDN fonts and libraries)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/divinerealmk9l0p2-netizen/Resume_ranking_system.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Resume_ranking_system
   ```
3. Open `index.html` in your web browser. 

## 📖 Usage Guide

1. **Upload**: Drag and drop all candidate resumes into the designated dropzone.
2. **Job Description**: Proceed to the next step and paste your detailed job description.
3. **Scan & Rank**: Click the analyze button. The system will extract text, compute TF-IDF scores, and present a ranked dashboard.
4. **Review**: Look at each candidate's card for detailed skill match breakdowns. Click **View Visualizer** to understand the mathematical data structures evaluating your candidates!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---
*Built with ❤️ for modern recruitment.*