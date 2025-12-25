'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Combobox } from "@headlessui/react";

type Country = {
  name: string;
  code: string;
};

const COUNTRIES: Country[] = [
  { name: 'Ethiopia', code: 'ET' },
  { name: 'United States', code: 'US' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'Canada', code: 'CA' },
  { name: 'Germany', code: 'DE' },
  { name: 'France', code: 'FR' },
  { name: 'India', code: 'IN' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'Kenya', code: 'KE' },
  { name: 'South Africa', code: 'ZA' },
  // (add more if you want — exhaustive list not required for demo)
];

export default function CreateCompanyPage() {
  /* -------------------- form state -------------------- */
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState<Country | null>(null);
  const [query, setQuery] = useState('');
  const [about, setAbout] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  /* -------------------- refs -------------------- */
  const fileInputRef = useRef<HTMLInputElement>(null);
  const comboButtonRef = useRef<HTMLButtonElement>(null);

  /* -------------------- touched state -------------------- */
  const [touched, setTouched] = useState({
    companyName: false,
    location: false,
    website: false,
  });

  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [creationProgress, setCreationProgress] = useState(0);

  /* -------------------- filtered countries -------------------- */
  const filteredCountries =
    query === ''
      ? COUNTRIES
      : COUNTRIES.filter((country) =>
          country.name
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  /* -------------------- progress -------------------- */
  const progress = useMemo(() => {
    const hasCompany = companyName.trim().length > 0;
    const hasLocation = Boolean(location);

    if (hasCompany && hasLocation) return 100;
    if (hasCompany || hasLocation) return 50;
    return 0;
  }, [companyName, location]);

  /* -------------------- validation -------------------- */
  const companyNameError =
    touched.companyName && companyName.trim() === ''
      ? '⚠ Company name is required'
      : '';

  const locationError =
    touched.location && !location ? '⚠ Please select a location' : '';

  const websiteError = useMemo(() => {
    if (!touched.website || website.trim() === '') return '';

    if (!website.startsWith('https://')) {
      return '⚠ Add https:// to make this a valid URL';
    }

    if (!/\.[a-z]{2,}$/i.test(website)) {
      return '⚠ Domain looks incomplete (e.g. .com)';
    }

    return '';
  }, [website, touched.website]);

  const isFormValid = companyName.trim() !== '' && location !== null;

  /* -------------------- logo handling -------------------- */
  // const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoSelect = (file: File) => {
    if (!['image/jpeg', 'image/png'].includes(file.type)) return;
    if (file.size > 5 * 1024 * 1024) return;

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  /* -------------------- submit -------------------- */
  const handleSubmit = async () => {
    if (!isFormValid) return;

    setLoading(true);
    setCreationProgress(0);

    // Simulate progress
    for (let i = 0; i <= 100; i += 25) {
      setCreationProgress(i);
      await new Promise((r) => setTimeout(r, 400));
    }

    setLoading(false);
    setShowSuccessModal(true);
  };

  /* -------------------- initials -------------------- */
  const initials = companyName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

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

      <div className={`flex-1 flex justify-center px-4 py-10 ${showSuccessModal ? 'items-start pt-24' : 'items-center'}`}>
        {!showSuccessModal ? (
          <div className="w-full max-w-[800px] bg-white rounded-xl shadow-sm border max-h-[90vh] flex flex-col">
            {/* ---------- Header ---------- */}
            <div className="px-6 pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center mb-3">
                  🏢
                </div>
                <h1 className="text-xl font-semibold text-neutral-900">
                  Company Information
                </h1>
                <p className="text-sm text-neutral-700 mt-1">
                  Fill out your company information below
                </p>
              </div>

              {/* ---------- Progress ---------- */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-neutral-600">
                    {progress}% complete
                  </span>
                  {progress === 100 && (
                    <span className="text-xs text-green-600 font-medium">
                      You’re ready to create your company
                    </span>
                  )}
                </div>
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* ---------- Scrollable Content ---------- */}
            <div className="px-6 py-6 overflow-y-auto space-y-6">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-bold mb-1 text-neutral-900">
                  Company name<span className="text-red-600">*</span>
                </label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  onBlur={() =>
                    setTouched((t) => ({ ...t, companyName: true }))
                  }
                  className="w-full rounded-md border-neutral-300 border px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter company name"
                />
                {companyNameError && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{companyNameError}</p>
                )}
              </div>

              {/* Location + Website */}
              <div className="flex flex-col md:flex-row gap-6">
                {/* Location */}
                <div className="flex-1">
                  <label className="block text-sm font-bold mb-1 text-neutral-900">
                    Location<span className="text-red-600">*</span>
                  </label>
                  <Combobox
                    value={location}
                    onChange={(val) => {
                      setLocation(val);
                      setTouched((t) => ({ ...t, location: true }));
                    }}
                    onClose={() => {
                      setQuery('');
                      setTouched((t) => ({ ...t, location: true }));
                    }}
                  >
                    {({ open }: { open: boolean }) => (
                      <div className="relative">
                        <Combobox.Button
                          ref={comboButtonRef}
                          className="relative w-full cursor-pointer rounded-md border-neutral-300 border px-3 py-2.5 text-left text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-black flex items-center justify-between"
                        >
                          <span className="block truncate">
                            {location ? (
                              location.name
                            ) : (
                              <span className="text-neutral-400">Select location</span>
                            )}
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`lucide lucide-chevron-down ml-auto h-4 w-4 transition-transform duration-200 ${
                              open ? 'rotate-180' : ''
                            }`}
                            aria-hidden="true"
                          >
                            <path d="m6 9 6 6 6-6"></path>
                          </svg>
                        </Combobox.Button>

                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-neutral-200 bg-white shadow-lg text-sm text-neutral-900 focus:outline-none">
                          <div className="sticky top-0 z-10 bg-white p-2 border-b">
                            <input
                              autoFocus
                              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                              placeholder="Search countries..."
                              value={query}
                              onChange={(event) => setQuery(event.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && filteredCountries.length > 0) {
                                  e.preventDefault();
                                  setLocation(filteredCountries[0]);
                                  setTouched((t) => ({ ...t, location: true }));
                                  setQuery('');
                                }
                              }}
                            />
                          </div>
                          {filteredCountries.length === 0 && query !== '' ? (
                            <div className="relative cursor-default select-none px-4 py-2 text-neutral-700">
                              Nothing found.
                            </div>
                          ) : (
                            filteredCountries.map((c) => (
                              <Combobox.Option
                                key={c.code}
                                value={c}
                                className={({ active }: { active: any }) =>
                                  `relative cursor-pointer select-none px-4 py-2 ${
                                    active ? 'bg-neutral-100' : ''
                                  }`
                                }
                              >
                                {c.name}
                              </Combobox.Option>
                            ))
                          )}
                        </Combobox.Options>
                      </div>
                    )}
                  </Combobox>
                  {locationError && (
                    <p className="text-xs text-red-600 mt-1 font-medium">
                      {locationError}
                    </p>
                  )}
                </div>

                {/* Website */}
                <div className="flex-1">
                  <label className="block text-sm font-bold mb-1 text-neutral-900">
                    Company website
                  </label>
                  <input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, website: true }))}
                    className="w-full rounded-md border-neutral-300 border px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="https://company.com"
                  />
                  {websiteError && (
                    <p className="text-xs text-red-600 mt-1 font-medium">
                      {websiteError}
                    </p>
                  )}
                </div>
              </div>

              {/* Logo */}
              <div>
                <label className="block text-sm font-bold mb-1 text-neutral-900">
                  Company logo
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer border-2 border-dashed border-neutral-300 rounded-lg p-8 flex flex-col items-center justify-center gap-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="h-16 w-16 rounded-full bg-neutral-900 text-white flex items-center justify-center text-lg font-bold shadow-md">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      initials || 'JD'
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-neutral-900">Click to upload logo</p>
                    <p className="text-xs text-neutral-600 mt-1">
                      JPG or PNG. Max 5MB.
                    </p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files && handleLogoSelect(e.target.files[0])
                  }
                />
              </div>

              {/* About */}
              <div>
                <label className="block text-sm font-bold mb-1 text-neutral-900">
                  About your company
                </label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={5}
                  className="w-full rounded-md border-neutral-300 border px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter a description"
                />
                <p className="text-xs text-neutral-600 mt-2">
                  Tell candidates what makes your company special.
                </p>
              </div>
            </div>

            {/* ---------- Sticky Footer ---------- */}
            <div className="px-6 py-4 border-t bg-white sticky bottom-0">
              <button
                disabled={!isFormValid || loading}
                onClick={handleSubmit}
                className="w-full bg-black text-white rounded-md py-2.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? `Creating account... ${creationProgress}%` : 'Create Company'}
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[800px] bg-neutral-50 rounded-xl shadow-sm border p-12 text-center">
            <div className="mb-8">
              <p className="text-lg font-semibold text-neutral-900">
                ✅ Company created successfully
              </p>
            </div>

            <div className="mb-10">
              <h2 className="text-3xl font-bold text-neutral-900 mb-3">
                Let’s create your first job
              </h2>
              <p className="text-neutral-600 text-lg">
                It takes about 2–3 minutes. Our AI will help you.
              </p>
            </div>

            <div className="space-y-6 max-w-md mx-auto">
              <div>
                <button
                  onClick={() => alert('Create job flow')}
                  className="w-full bg-black text-white rounded-xl py-4 text-lg font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Create Job Now
                </button>
                <p className="text-xs text-neutral-500 mt-2">
                  Takes ~2–3 minutes
                </p>
              </div>

              <div>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="text-neutral-600 hover:underline text-sm font-medium"
                >
                  I’ll do this later
                </button>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-neutral-100">
              <p className="text-xs text-neutral-500 leading-relaxed">
                You can edit your company details and jobs anytime from the dashboard.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )}