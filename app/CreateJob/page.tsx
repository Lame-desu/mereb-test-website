'use client';

import { useMemo, useState, useEffect } from 'react';

type Company = { id: string; name: string };
type Country = { code: string; name: string };

const COMPANIES: Company[] = [
  { id: '1', name: 'Anonymous Company' },
  { id: '2', name: 'Acme Inc.' },
];

const COUNTRIES: Country[] = [
  { code: 'ET', name: 'Ethiopia' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IN', name: 'India' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
];

const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Internship',
  'Contract',
  'Freelance',
];

const WORKPLACE_TYPES = ['On-site', 'Remote', 'Hybrid'];

const EXPERIENCE_LEVELS = [
  'Entry level',
  'Mid level',
  'Senior level',
  'Lead',
  'Executive',
];

const STEPS = [
  { id: 1, label: 'Basic Information' },
  { id: 2, label: 'Job Details' },
  { id: 3, label: 'Ideal Qualifications' },
  { id: 4, label: 'Review & Publish' },
];

export default function JobBasicInfoPage() {
  /* ---------------- state ---------------- */
  const [step, setStep] = useState(1);
  const [companyId, setCompanyId] = useState(COMPANIES[0].id);
  const [jobTitle, setJobTitle] = useState('');
  const [jobTitleTouched, setJobTitleTouched] = useState(false);

  const [country, setCountry] = useState<Country | null>(null);
  const [countryTouched, setCountryTouched] = useState(false);
  const [countryQuery, setCountryQuery] = useState('');

  const [city, setCity] = useState('');

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [workplaces, setWorkplaces] = useState<string[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);

  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [currency, setCurrency] = useState('');

  const [jobDescription, setJobDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [benefits, setBenefits] = useState('');

  const [mustHaveQualifications, setMustHaveQualifications] = useState('');
  const [preferredQualifications, setPreferredQualifications] = useState('');

  const [showSalary, setShowSalary] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [showResponsibilities, setShowResponsibilities] = useState(false);
  const [showBenefits, setShowBenefits] = useState(false);

  const [showJobType, setShowJobType] = useState(true);
  const [showWorkplace, setShowWorkplace] = useState(true);
  const [showExperience, setShowExperience] = useState(true);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [publishMode, setPublishMode] = useState<'publish' | 'draft'>('publish');

  /* ---------------- effects ---------------- */
  useEffect(() => {
    if (isAnalyzing) {
      setAnalysisStep(0);
      const intervals = [1000, 2000, 3000, 4000];
      
      const timers = intervals.map((ms, idx) => 
        setTimeout(() => {
          setAnalysisStep(idx + 1);
          if (idx === intervals.length - 1) {
            setTimeout(() => {
              setIsAnalyzing(false);
              setStep(3);
            }, 1000);
          }
        }, ms)
      );

      return () => timers.forEach(clearTimeout);
    }
  }, [isAnalyzing]);

  /* ---------------- helpers ---------------- */
  const toggleMulti = (
    value: string,
    list: string[],
    setter: (v: string[]) => void
  ) => {
    setter(
      list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value]
    );
  };

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(countryQuery.toLowerCase())
  );

  /* ---------------- progress ---------------- */
  const progress = useMemo(() => {
    if (step === 1) {
      let score = 0;
      if (companyId) score += 33.3;
      if (jobTitle.trim() !== '') score += 33.3;
      if (country) score += 33.4;
      return Math.round(score);
    }
    if (step === 2) {
      return jobDescription.trim() !== '' ? 100 : 0;
    }
    if (step === 3) {
      return 100; // Step 3 is optional
    }
    return 100;
  }, [step, companyId, jobTitle, country, jobDescription]);

  /* ---------------- validation ---------------- */
  const jobTitleError =
    jobTitleTouched && jobTitle.trim() === ''
      ? '⚠ Job title is required'
      : '';

  const countryError =
    countryTouched && !country ? '⚠ Country is required' : '';

  const salaryError = useMemo(() => {
    if (!minSalary || !maxSalary) return '';
    if (Number(maxSalary) <= Number(minSalary)) {
      return '⚠ Max salary must be greater than min salary';
    }
    return '';
  }, [minSalary, maxSalary]);

  const currencyError =
    (minSalary || maxSalary) && !currency
      ? '⚠ Currency is required'
      : '';

  const isValid = useMemo(() => {
    if (step === 1) {
      return jobTitle.trim() !== '' && country !== null;
    }
    if (step === 2) {
      return (
        jobDescription.trim() !== '' &&
        !salaryError &&
        !currencyError
      );
    }
    if (step === 3) {
      return true; // Step 3 is optional
    }
    return true;
  }, [step, jobTitle, country, jobDescription, salaryError, currencyError]);

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="bg-white py-10 px-12 border-b">
        <img
          alt="CompaniaI Logo"
          loading="lazy"
          width="200"
          height="42"
          decoding="async"
          data-nimg="1"
          className="h-[42px] w-auto"
          src="/logo.png"
          style={{ color: 'transparent' }}
        />
      </header>

      <div className="flex-1 flex items-start justify-center px-4 py-10 overflow-x-hidden">
        <div className="flex w-full max-w-[1600px] gap-8 items-start justify-center">
          {/* Left Spacer to center the form */}
          <div className="hidden xl:block flex-1 max-w-[400px]" />

          {/* ---------- Main Modal: Form ---------- */}
          <div className="w-full max-w-[800px] bg-white rounded-xl shadow-sm border max-h-[85vh] flex flex-col overflow-hidden shrink-0">
            {/* ---------- Header ---------- */}
            <div className="px-6 pt-8">
              <div className="flex flex-col items-center text-center mb-8">
                <h1 className="text-xl font-semibold text-neutral-900">
                  Create Job Opening
                </h1>
                <p className="text-sm text-neutral-700 mt-1">
                  {step === 1 ? 'Fill out the basic information for your new job post' : 
                   step === 2 ? 'Add more details to your job post' :
                   step === 3 ? 'Specify the qualifications for this role' :
                   'Review and publish your job post'}
                </p>
              </div>

            {/* Stepper */}
            <div className="flex items-center justify-between max-w-2xl mx-auto mb-10 px-4">
              {STEPS.map((s, idx) => {
                const isCurrent = step === s.id;
                const isCompleted = step > s.id;
                const radius = 22;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (progress / 100) * circumference;

                return (
                  <div key={s.id} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center relative z-10 bg-white pr-2">
                      <div className="relative h-12 w-12 flex items-center justify-center">
                        {/* Circular Progress SVG - Hidden for Step 3 as it's optional */}
                        {isCurrent && s.id !== 3 && (
                          <svg className="absolute inset-0 h-full w-full -rotate-90">
                            <circle
                              cx="24"
                              cy="24"
                              r={radius}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              className="text-neutral-100"
                            />
                            <circle
                              cx="24"
                              cy="24"
                              r={radius}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeDasharray={circumference}
                              strokeDashoffset={offset}
                              strokeLinecap="round"
                              className="transition-all duration-500 ease-in-out text-emerald-600"
                            />
                          </svg>
                        )}
                        
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 border-2 ${
                            isCompleted
                              ? 'bg-black text-white border-black'
                              : isCurrent
                              ? `bg-white text-black ${s.id === 3 ? 'border-neutral-200' : 'border-transparent'}`
                              : 'bg-white text-neutral-400 border-neutral-200'
                          }`}
                        >
                          {isCompleted ? '✓' : s.id}
                        </div>
                      </div>
                      <span
                        className={`text-[11px] mt-2 font-medium whitespace-nowrap transition-colors duration-200 ${
                          step >= s.id ? 'text-neutral-900' : 'text-neutral-400'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className={`flex-1 h-[2px] -mt-8 mx-2 ${step > s.id ? 'bg-black' : 'bg-neutral-200'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---------- Scrollable Content ---------- */}
          <div className="px-6 py-6 overflow-y-auto space-y-6 flex-1">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-8">
                <div className="relative h-48 w-48 flex items-center justify-center">
                  {/* Outer Light Gray Circle */}
                  <div className="absolute inset-0 bg-neutral-100/80 rounded-full" />

                  {/* Ripple Effect */}
                  <div className="absolute h-32 w-32 border-2 border-neutral-300/30 rounded-full animate-ripple" />
                  <div className="absolute h-32 w-32 border-2 border-neutral-300/30 rounded-full animate-ripple" style={{ animationDelay: '1s' }} />
                  
                  {/* Inner White Circle */}
                  <div className="relative h-32 w-32 bg-white rounded-full shadow-sm flex items-center justify-center border border-neutral-100 z-10">
                    <div className="relative">
                      {/* Brain Icon */}
                      <svg className="h-14 w-14 text-neutral-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a2 2 0 01-2-2m2 2a2 2 0 002-2m-2 2V17m0-13a7 7 0 00-7 7 7 7 0 007 7m0-14a7 7 0 017 7 7 7 0 01-7 7m0-14v14" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8c-.5 0-1 .5-1 1s.5 1 1 1" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 8c.5 0 1 .5 1 1s-.5 1-1 1" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12c-.5 0-1 .5-1 1s.5 1 1 1" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12c.5 0 1 .5 1 1s-.5 1-1 1" />
                      </svg>
                      
                      {/* Rotating Star */}
                      <div className="absolute inset-0 flex items-center justify-center animate-orbit">
                        <div className="bg-white rounded-full p-1.5 shadow-sm border border-neutral-100 flex items-center justify-center">
                          <svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-xl font-bold text-neutral-900">AI is analyzing your job</h2>
                  <p className="text-sm text-neutral-500 mt-1">This could take up to a minute</p>
                </div>

                <div className="w-full max-w-md space-y-6 px-8">
                  {[
                    { label: 'Reading job details', icon: (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )},
                    { label: 'Analyzing requirements', icon: (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )},
                    { label: 'Identifying qualifications', icon: (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    )},
                    { label: 'Generating suggestions', icon: (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.143-6.857L1 12l7.714-2.143L11 3z" />
                      </svg>
                    )},
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`${analysisStep >= idx ? 'text-neutral-900' : 'text-neutral-400'}`}>
                          {item.icon}
                        </div>
                        <span className={`text-sm font-medium ${analysisStep >= idx ? 'text-neutral-900' : 'text-neutral-400'}`}>
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className={`h-1.5 w-1.5 rounded-full ${analysisStep > idx ? 'bg-neutral-300' : analysisStep === idx ? 'bg-neutral-900 animate-bounce' : 'bg-neutral-200'}`} style={{ animationDelay: '0ms' }} />
                        <div className={`h-1.5 w-1.5 rounded-full ${analysisStep > idx ? 'bg-neutral-300' : analysisStep === idx ? 'bg-neutral-900 animate-bounce' : 'bg-neutral-200'}`} style={{ animationDelay: '150ms' }} />
                        <div className={`h-1.5 w-1.5 rounded-full ${analysisStep > idx ? 'bg-neutral-300' : analysisStep === idx ? 'bg-neutral-900 animate-bounce' : 'bg-neutral-200'}`} style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {step === 1 && (
                  <>
                    {/* Company */}
                <div>
                  <label className="block text-sm font-bold mb-1 text-neutral-900">
                    Company<span className="text-red-600">*</span>
                  </label>
                  <select
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="w-full rounded-md border-neutral-300 border px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  >
                    {COMPANIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Job title */}
                <div>
                  <label className="block text-sm font-bold mb-1 text-neutral-900">
                    Job title<span className="text-red-600">*</span>
                  </label>
                  <input
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    onBlur={() => setJobTitleTouched(true)}
                    className="w-full rounded-md border-neutral-300 border px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="e.g. Senior Software Engineer"
                  />
                  {jobTitleError && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{jobTitleError}</p>
                  )}
                </div>

                {/* Country + City */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-1 text-neutral-900">
                      Country<span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="border border-neutral-300 rounded-md overflow-hidden">
                        <input
                          value={countryQuery}
                          onFocus={() => setIsCountryDropdownOpen(true)}
                          onChange={(e) => {
                            setCountryQuery(e.target.value);
                            setIsCountryDropdownOpen(true);
                          }}
                          onBlur={() => {
                            // Small delay to allow onClick to fire
                            setTimeout(() => setIsCountryDropdownOpen(false), 200);
                            setCountryTouched(true);
                          }}
                          placeholder="Search country"
                          className="w-full px-3 py-2.5 text-sm text-neutral-900 focus:outline-none border-b border-neutral-200"
                        />
                        {isCountryDropdownOpen && (
                          <div className="max-h-40 overflow-y-auto bg-white">
                            {filteredCountries.length > 0 ? (
                              filteredCountries.map((c) => (
                                <div
                                  key={c.code}
                                  onClick={() => {
                                    setCountry(c);
                                    setCountryQuery(c.name);
                                    setIsCountryDropdownOpen(false);
                                  }}
                                  className={`cursor-pointer px-4 py-2 text-sm hover:bg-neutral-100 ${
                                    country?.code === c.code ? 'bg-neutral-50 font-semibold text-neutral-900' : 'text-neutral-700'
                                  }`}
                                >
                                  {c.name}
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-2 text-sm text-neutral-500">No countries found</div>
                            )}
                          </div>
                        )}
                      </div>
                      {country && (
                        <div className="mt-2 text-sm text-neutral-900 font-medium">
                          Selected: {country.name}
                        </div>
                      )}
                    </div>
                    {countryError && (
                      <p className="text-xs text-red-600 mt-1 font-medium">{countryError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1 text-neutral-900">City</label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-md border-neutral-300 border px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="e.g. Addis Ababa"
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {/* Job Description */}
                <div>
                  <label className="block text-sm font-bold mb-1 text-neutral-900">
                    Job Description<span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={5}
                    className="w-full rounded-md border-neutral-300 border px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                  />
                </div>

                {/* Multi-select groups */}
                {[
                  ['Job Type', JOB_TYPES, jobTypes, setJobTypes, showJobType, setShowJobType],
                  ['Workplace Type', WORKPLACE_TYPES, workplaces, setWorkplaces, showWorkplace, setShowWorkplace],
                  ['Experience Level', EXPERIENCE_LEVELS, experienceLevels, setExperienceLevels, showExperience, setShowExperience],
                ].map(([label, options, values, setter, isShown, setIsShown]: any) => (
                  <div key={label}>
                    {!isShown ? (
                      <button
                        onClick={() => setIsShown(true)}
                        className="text-sm font-bold text-black hover:underline flex items-center"
                      >
                        + Add {label}
                      </button>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-bold text-neutral-900">{label}</p>
                          <button
                            onClick={() => setIsShown(false)}
                            className="text-xs text-neutral-500 hover:text-neutral-900 hover:underline"
                          >
                            Collapse
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {options.map((opt: string) => {
                            const selected = values.includes(opt);
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => toggleMulti(opt, values, setter)}
                                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                                  selected
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400'
                                }`}
                              >
                                {selected ? '✓ ' : '+ '} {opt}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {/* Optional Sections */}
                <div className="space-y-4 pt-4">
                  {/* Salary */}
                  {!showSalary ? (
                    <button
                      onClick={() => setShowSalary(true)}
                      className="text-sm font-bold text-black hover:underline flex items-center"
                    >
                      + Add Salary Range
                    </button>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-bold text-neutral-900">Salary Range</label>
                        <button
                          onClick={() => setShowSalary(false)}
                          className="text-xs text-neutral-500 hover:text-neutral-900 hover:underline"
                        >
                          Collapse
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="number"
                          placeholder="Min salary"
                          value={minSalary}
                          onChange={(e) => setMinSalary(e.target.value)}
                          className="w-full rounded-md border-neutral-300 border px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <input
                          type="number"
                          placeholder="Max salary"
                          value={maxSalary}
                          onChange={(e) => setMaxSalary(e.target.value)}
                          className="w-full rounded-md border-neutral-300 border px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="w-full rounded-md border-neutral-300 border px-3 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black bg-white"
                        >
                          <option value="">Currency</option>
                          <option>USD</option>
                          <option>EUR</option>
                          <option>ETB</option>
                        </select>
                      </div>
                      {(salaryError || currencyError) && (
                        <p className="text-xs text-red-600 mt-2 font-medium">
                          {salaryError || currencyError}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Requirements */}
                  {!showRequirements ? (
                    <button
                      onClick={() => setShowRequirements(true)}
                      className="text-sm font-bold text-black hover:underline flex items-center"
                    >
                      + Add Requirements
                    </button>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-bold text-neutral-900">Requirements</label>
                        <button
                          onClick={() => setShowRequirements(false)}
                          className="text-xs text-neutral-500 hover:text-neutral-900 hover:underline"
                        >
                          Collapse
                        </button>
                      </div>
                      <textarea
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        rows={3}
                        className="w-full rounded-md border-neutral-300 border px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="List the key requirements..."
                      />
                    </div>
                  )}

                  {/* Responsibilities */}
                  {!showResponsibilities ? (
                    <button
                      onClick={() => setShowResponsibilities(true)}
                      className="text-sm font-bold text-black hover:underline flex items-center"
                    >
                      + Add Responsibilities
                    </button>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-bold text-neutral-900">Responsibilities</label>
                        <button
                          onClick={() => setShowResponsibilities(false)}
                          className="text-xs text-neutral-500 hover:text-neutral-900 hover:underline"
                        >
                          Collapse
                        </button>
                      </div>
                      <textarea
                        value={responsibilities}
                        onChange={(e) => setResponsibilities(e.target.value)}
                        rows={3}
                        className="w-full rounded-md border-neutral-300 border px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="List the key responsibilities..."
                      />
                    </div>
                  )}

                  {/* Benefits */}
                  {!showBenefits ? (
                    <button
                      onClick={() => setShowBenefits(true)}
                      className="text-sm font-bold text-black hover:underline flex items-center"
                    >
                      + Add Benefits
                    </button>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-bold text-neutral-900">Benefits</label>
                        <button
                          onClick={() => setShowBenefits(false)}
                          className="text-xs text-neutral-500 hover:text-neutral-900 hover:underline"
                        >
                          Collapse
                        </button>
                      </div>
                      <textarea
                        value={benefits}
                        onChange={(e) => setBenefits(e.target.value)}
                        rows={3}
                        className="w-full rounded-md border-neutral-300 border px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="List the perks and benefits..."
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Ideal Qualifications</h2>
                  <p className="text-sm text-neutral-500 mt-1">
                    Here are draft qualifications, add anything else you need. These won't be seen by job seekers.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-neutral-900">Must-have qualifications</label>
                    <p className="text-xs text-neutral-500 mt-0.5 mb-2">
                      Your applicants must have these qualifications to be considered for the role.
                    </p>
                    <div className="relative">
                      <textarea
                        value={mustHaveQualifications}
                        onChange={(e) => setMustHaveQualifications(e.target.value)}
                        rows={6}
                        className="w-full rounded-lg border-neutral-200 border px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black resize-none"
                        placeholder="Describe must-have qualifications..."
                      />
                      <div className="text-[10px] text-neutral-400 text-right mt-1">
                        {mustHaveQualifications.length}/4,000
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-neutral-900">Preferred qualifications</label>
                    <p className="text-xs text-neutral-500 mt-0.5 mb-2">
                      Your applicants don't need to have these qualifications, but you prefer to hire someone with them.
                    </p>
                    <div className="relative">
                      <textarea
                        value={preferredQualifications}
                        onChange={(e) => setPreferredQualifications(e.target.value)}
                        rows={6}
                        className="w-full rounded-lg border-neutral-200 border px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black resize-none"
                        placeholder="Describe preferred qualifications..."
                      />
                      <div className="text-[10px] text-neutral-400 text-right mt-1">
                        {preferredQualifications.length}/4,000
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="py-10 text-center">
                <div className="mb-6">
                  <div className={`h-16 w-16 ${publishMode === 'publish' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {publishMode === 'publish' ? (
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900">
                    {publishMode === 'publish' ? 'Ready to Publish?' : 'Save as Draft?'}
                  </h2>
                  <p className="text-neutral-600 mt-2">
                    Review the details on the right before making it live.{' '}
                    <button
                      onClick={() => setPublishMode(publishMode === 'publish' ? 'draft' : 'publish')}
                      className="text-black font-semibold hover:underline"
                    >
                      {publishMode === 'publish' ? 'or save as a draft?' : 'or publish job?'}
                    </button>
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ---------- Sticky Footer ---------- */}
          <div className="px-6 py-4 border-t bg-white sticky bottom-0 grid grid-cols-2 gap-4">
            <button 
              disabled={isAnalyzing}
              onClick={() => {
                if (step === 1) window.history.back();
                else setStep(step - 1);
              }}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:underline py-2.5 text-center disabled:opacity-30"
            >
              {step === 1 ? 'Cancel job creation' : `← ${STEPS[step - 2].label}`}
            </button>
            
            {step === 4 ? (
              <button
                onClick={() => {
                  if (publishMode === 'publish') alert('Publishing Job...');
                  else alert('Saving as Draft...');
                }}
                className="bg-black text-white w-full py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-neutral-800"
              >
                {publishMode === 'publish' ? 'Publish Job' : 'Save as Draft'}
              </button>
            ) : (
              <button
                disabled={!isValid || isAnalyzing}
                onClick={() => {
                  if (step === 2) setIsAnalyzing(true);
                  else if (step < 4) setStep(step + 1);
                }}
                className="bg-black text-white w-full py-2.5 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-neutral-800"
              >
                {isAnalyzing ? 'Analyzing...' : `Continue → ${STEPS[step].label}`}
              </button>
            )}
          </div>
        </div>

        {/* ---------- Right Side: Live Review ---------- */}
        <div className="hidden xl:block flex-1 max-w-[400px] bg-white rounded-xl shadow-sm border max-h-[85vh] overflow-y-auto p-8 shrink-0">
          <div className="space-y-8">
            {/* Job Summary */}
            <div>
              <h3 className="text-lg font-bold text-neutral-900 mb-6">Job Summary</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-sm font-bold text-neutral-900 w-24 shrink-0">Company:</span>
                  <span className="text-sm text-neutral-700">
                    {COMPANIES.find(c => c.id === companyId)?.name || 'Not specified'}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-sm font-bold text-neutral-900 w-24 shrink-0">Title:</span>
                  <span className="text-sm text-neutral-700">{jobTitle || 'Not specified'}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-sm font-bold text-neutral-900 w-24 shrink-0">Job Type:</span>
                  <span className="text-sm text-neutral-700">
                    {jobTypes.length > 0 ? jobTypes.join(', ') : 'Not specified'}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-sm font-bold text-neutral-900 w-24 shrink-0">Workplace:</span>
                  <span className="text-sm text-neutral-700">
                    {workplaces.length > 0 ? workplaces.join(', ') : 'Not specified'}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-sm font-bold text-neutral-900 w-24 shrink-0">Location:</span>
                  <span className="text-sm text-neutral-700">
                    {city && country ? `${city}, ${country.name}` : country ? country.name : city || 'Not specified'}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-sm font-bold text-neutral-900 w-24 shrink-0">Experience:</span>
                  <span className="text-sm text-neutral-700">
                    {experienceLevels.length > 0 ? experienceLevels.join(', ') : 'Not specified'}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-sm font-bold text-neutral-900 w-24 shrink-0">Salary:</span>
                  <span className="text-sm text-neutral-700">
                    {minSalary && maxSalary && currency ? `${currency} ${minSalary} - ${maxSalary}` : 'Not specified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Must have Qualifications */}
            <div>
              <h3 className="text-sm font-bold text-neutral-900 mb-3">Must have Qualifications</h3>
              <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
                {mustHaveQualifications || 'No must-have qualifications provided.'}
              </p>
            </div>

            {/* Preferred Qualifications */}
            <div>
              <h3 className="text-sm font-bold text-neutral-900 mb-3">Preferred Qualifications</h3>
              <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
                {preferredQualifications || 'No preferred qualifications provided.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
