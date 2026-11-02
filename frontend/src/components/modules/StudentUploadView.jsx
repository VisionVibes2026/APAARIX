import React, { useState, useEffect } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  FileCheck,
  Send,
  HelpCircle
} from 'lucide-react';
import { getInstitutions, validateUploadBatch, commitUploadBatch, downloadCsvTemplate } from '../../services/api';

export default function StudentUploadView({ onUploadComplete }) {
  const [institutions, setInstitutions] = useState([]);
  const [selectedInstId, setSelectedInstId] = useState('');
  const [selectedProgId, setSelectedProgId] = useState('');
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [programmes, setProgrammes] = useState([]);

  // CSV Text / File
  const [csvContent, setCsvContent] = useState('');
  const [validating, setValidating] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [commitResult, setCommitResult] = useState(null);

  useEffect(() => {
    getInstitutions().then(res => {
      const list = res.data || [];
      setInstitutions(list);
      if (list.length > 0) {
        setSelectedInstId(list[0].id);
      }
    }).catch(console.error);
  }, []);

  // Set mock programs when institution changes
  useEffect(() => {
    if (selectedInstId) {
      const progs = [
        { id: 1, name: 'Computer Science & Engineering (B.Tech)' },
        { id: 2, name: 'Electronics & Communication Engg (B.Tech)' },
        { id: 3, name: 'Information Technology (B.Tech)' },
        { id: 4, name: 'Artificial Intelligence & Data Science (B.Tech)' }
      ];
      setProgrammes(progs);
      setSelectedProgId(progs[0].id);
    }
  }, [selectedInstId]);

  const loadSampleRecords = () => {
    const sample = `fullName,apaarId,dateOfBirth,gender,email,mobileNumber,admissionCategory
Aditya Kulkarni,7842-1982-3041,2004-03-12,Male,aditya.k@example.com,+91-9811223344,GENERAL
Sneha Mukherjee,6531-8721-4920,2003-11-25,Female,sneha.m@example.com,+91-9822334455,OBC
Karthik Hegde,5420-7610-3819,2004-06-19,Male,karthik.h@example.com,+91-9833445566,EWS
Rohan Patel,6345-1012-7643,2003-08-14,Male,rohan.p@example.com,+91-9844556677,GENERAL
Tanvi Joshi,9999-1234-5678,2004-09-02,Female,tanvi.j@example.com,+91-9855667788,GENERAL
Invalid Candidate,12345,2004-01-01,Other,invalid@example.com,+91-9800000000,SC`;
    setCsvContent(sample);
    setValidationResult(null);
    setCommitResult(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvContent(event.target.result);
      setValidationResult(null);
      setCommitResult(null);
    };
    reader.readAsText(file);
  };

  const parseCsvToJson = (text) => {
    const lines = text.trim().split('\n').filter(l => l.trim().length > 0);
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim());

    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] || '';
      });
      records.push(row);
    }
    return records;
  };

  const handleValidate = async () => {
    const records = parseCsvToJson(csvContent);
    if (records.length === 0) {
      alert('Please enter or upload valid CSV records with headers.');
      return;
    }

    setValidating(true);
    setCommitResult(null);
    try {
      const res = await validateUploadBatch({
        institutionId: selectedInstId,
        programmeId: selectedProgId,
        academicYear: academicYear,
        records: records
      });
      setValidationResult(res.data);
    } catch (err) {
      alert(err.message || 'Validation error');
    } finally {
      setValidating(false);
    }
  };

  const handleCommit = async () => {
    if (!validationResult || validationResult.validRecords.length === 0) {
      alert('No valid records to commit.');
      return;
    }

    setCommitting(true);
    try {
      const res = await commitUploadBatch({
        institutionId: selectedInstId,
        programmeId: selectedProgId,
        academicYear: academicYear,
        records: validationResult.validRecords
      });
      setCommitResult(res.data);
      if (onUploadComplete) onUploadComplete();
    } catch (err) {
      alert(err.message || 'Commit failed');
    } finally {
      setCommitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration Header Card */}
      <div className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl p-5 ant-card-shadow space-y-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <UploadCloud className="w-4 h-4 text-brand-primary" />
            <span>Institution Student Ingestion Docket</span>
          </h2>
          <p className="text-xs text-brand-text-secondary dark:text-dark-text-secondary mt-0.5">
            Select institution and target programme to validate incoming student enrolments against AICTE registry.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-brand-text-secondary block mb-1">
              Admitting Institution:
            </label>
            <select
              value={selectedInstId}
              onChange={(e) => setSelectedInstId(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-lg border border-brand-border dark:border-dark-border bg-gray-50 dark:bg-dark-container text-gray-900 dark:text-white outline-none"
            >
              {institutions.map(i => <option key={i.id} value={i.id}>{i.name} ({i.code})</option>)}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-brand-text-secondary block mb-1">
              Target Academic Programme:
            </label>
            <select
              value={selectedProgId}
              onChange={(e) => setSelectedProgId(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-lg border border-brand-border dark:border-dark-border bg-gray-50 dark:bg-dark-container text-gray-900 dark:text-white outline-none"
            >
              {programmes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-brand-text-secondary block mb-1">
              Academic Session Year:
            </label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-lg border border-brand-border dark:border-dark-border bg-gray-50 dark:bg-dark-container text-gray-900 dark:text-white outline-none"
            >
              <option value="2024-2025">AY 2024-2025</option>
              <option value="2023-2024">AY 2023-2024</option>
            </select>
          </div>
        </div>
      </div>

      {/* CSV Input & Ingestion Section */}
      <div className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl p-5 ant-card-shadow space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Student Records Docket (CSV Format)
            </h3>
            <p className="text-[11px] text-brand-text-secondary">
              Upload a .csv file or paste formatted rows containing mandatory APAAR IDs.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadSampleRecords}
              className="px-2.5 py-1 text-xs font-medium rounded-lg border border-brand-border dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-container text-brand-primary"
            >
              Load Sample Test Batch
            </button>
            <a
              href={downloadCsvTemplate()}
              className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 dark:bg-dark-container hover:bg-gray-200 text-gray-700 dark:text-gray-200"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Sample Template</span>
            </a>
          </div>
        </div>

        {/* Drag Drop or Textarea */}
        <div className="space-y-3">
          <textarea
            rows={7}
            value={csvContent}
            onChange={(e) => { setCsvContent(e.target.value); setValidationResult(null); }}
            placeholder="fullName,apaarId,dateOfBirth,gender,email,mobileNumber,admissionCategory..."
            className="w-full p-3 font-mono text-xs rounded-lg border border-brand-border dark:border-dark-border bg-gray-50 dark:bg-dark-container text-gray-900 dark:text-white outline-none focus:border-brand-primary"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="text-xs text-brand-text-secondary file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-brand-primary hover:file:bg-blue-100"
            />

            <button
              onClick={handleValidate}
              disabled={validating || !csvContent.trim()}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg text-xs font-semibold shadow disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${validating ? 'animate-spin' : ''}`} />
              <span>{validating ? 'Analyzing Records...' : 'Validate Batch Integrity'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Validation Result Summary & Preview */}
      {validationResult && (
        <div className="bg-white dark:bg-dark-card border border-brand-border dark:border-dark-border rounded-xl p-5 ant-card-shadow space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-border dark:border-dark-border">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Batch Validation Diagnostic Summary</span>
            </h3>

            {validationResult.validCount > 0 && (
              <button
                onClick={handleCommit}
                disabled={committing}
                className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow disabled:opacity-50 transition-all"
              >
                <Send className={`w-3.5 h-3.5 ${committing ? 'animate-spin' : ''}`} />
                <span>{committing ? 'Committing...' : `Commit ${validationResult.validCount} Valid Records`}</span>
              </button>
            )}
          </div>

          {/* Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
              <span className="text-[11px] text-brand-text-secondary block">Total Ingested:</span>
              <span className="text-xl font-bold font-kpi text-blue-700 dark:text-blue-300">
                {validationResult.totalRecords}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
              <span className="text-[11px] text-brand-text-secondary block">Valid & Approved:</span>
              <span className="text-xl font-bold font-kpi text-emerald-700 dark:text-emerald-300">
                {validationResult.validCount}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
              <span className="text-[11px] text-brand-text-secondary block">Duplicate Detected:</span>
              <span className="text-xl font-bold font-kpi text-amber-700 dark:text-amber-300">
                {validationResult.duplicateCount}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900">
              <span className="text-[11px] text-brand-text-secondary block">Format Errors:</span>
              <span className="text-xl font-bold font-kpi text-rose-700 dark:text-rose-300">
                {validationResult.invalidCount}
              </span>
            </div>
          </div>

          {/* Duplicates Alert Box if any */}
          {validationResult.duplicateRecords.length > 0 && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Multi-Tenancy Duplicate Enrolment Warning</span>
              </div>
              <ul className="text-xs text-amber-900 dark:text-amber-200 list-disc list-inside space-y-1">
                {validationResult.duplicateRecords.map((d, i) => (
                  <li key={i}>
                    <strong>{d.fullName}</strong> (APAAR: {d.apaarId}) — {d.matchReason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Invalid Records Error Box if any */}
          {validationResult.invalidRecords.length > 0 && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-lg space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-800 dark:text-rose-300">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Invalid Format Rejections</span>
              </div>
              <ul className="text-xs text-rose-900 dark:text-rose-200 list-disc list-inside space-y-1">
                {validationResult.invalidRecords.map((inv, i) => (
                  <li key={i}>
                    Row {inv.rowNumber}: <strong>{inv.fullName || 'Unnamed'}</strong> — {inv.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Success Commit Banner */}
      {commitResult && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <div>
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                Batch Successfully Committed to National Student Registry!
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                {commitResult.insertedCount} new student records registered under {commitResult.institutionName}. APAAR verification initiated.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

