'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
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
    let filled = 0;
    if (companyName.trim().length > 0) filled++;
    if (location) filled++;
    if (website.trim().length > 0) filled++;
    if (logoFile) filled++;
    if (about.trim().length > 0) filled++;

    return Math.round((filled / 5) * 100);
  }, [companyName, location, website, logoFile, about]);

  /* -------------------- validation -------------------- */
  const companyNameError =
    touched.companyName && companyName.trim() === ''
      ? '⚠ Company name is required'
      : '';

  const locationError =
    touched.location && !location ? '⚠ Please select a location' : '';

  const websiteValidationError = useMemo(() => {
    if (website.trim() === '') return '';

    if (!website.startsWith('https://')) {
      return '⚠ Add https:// to make this a valid URL';
    }

    if (!/\.[a-z]{2,}$/i.test(website)) {
      return '⚠ Domain looks incomplete (e.g. .com)';
    }

    return '';
  }, [website]);

  const websiteError = (touched.website || website.trim() !== '') ? websiteValidationError : '';

  const isFormValid = companyName.trim() !== '' && location !== null && websiteValidationError === '';

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
      <header className="bg-white py-5 px-12 border-b">
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
                </div>
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {isFormValid && (
                  <div className="mt-4 flex items-center justify-center space-x-2 text-emerald-600 bg-emerald-50/50 px-4 py-2 rounded-lg border border-emerald-100">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs font-bold">You’re ready to create your company</span>
                  </div>
                )}
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
          <div className="w-full max-w-[800px] bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden">
            {/* Success Banner */}
            <div className="bg-emerald-50 py-4 px-6 flex items-center justify-center space-x-2 border-b border-emerald-100">
              <div className="h-6 w-6 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-bold text-emerald-800 uppercase tracking-wider">
                Company created successfully
              </p>
            </div>

            <div className="pt-12 pb-6 text-center">
              {/* Amazing Company Identity Section */}
              <div className="mb-12 flex flex-col items-center">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative h-32 w-32 rounded-3xl bg-white shadow-2xl flex items-center justify-center overflow-hidden border border-neutral-100">
                    {logoPreview ? (
                      <img src={logoPreview} alt={companyName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-neutral-900 to-neutral-700 flex items-center justify-center">
                        <span className="text-4xl font-black text-white tracking-tighter">{initials}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6">
                  <h2 className="text-4xl font-black text-neutral-900 tracking-tight mb-2">
                    {companyName}
                  </h2>
                  <div className="flex items-center justify-center space-x-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-neutral-100 text-neutral-600">
                      <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {location?.name}
                    </span>
                    {website && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600">
                        <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        {website.replace('https://', '')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-2xl font-bold text-neutral-900 mb-3">
                  Ready to hire?
                </h3>
                <p className="text-neutral-600 text-lg max-w-md mx-auto">
                  Let's create your first job post. Our AI assistant will help you draft it in seconds.
                </p>
              </div>

              <div className="space-y-4 max-w-sm mx-auto">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => router.push('/CreateJob')}
                    className="w-full bg-black text-white rounded-2xl py-4 text-lg font-bold hover:bg-neutral-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                  >
                    Create Your First Job
                  </button>
                  <p className="text-xs text-neutral-500 mt-3 font-medium">
                    ⏱ Takes approximately 2–3 minutes
                  </p>
                </div>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full text-neutral-500 hover:text-neutral-900 hover:underline text-sm font-bold transition-colors pt-2"
                >
                  I'll do this later
                </button>
              </div>
            </div>
            <div className="bg-neutral-50/50 py-2 px-12 border-t border-neutral-100 text-center">
              <p className="text-xs text-neutral-500 leading-relaxed">
                You can edit your company details and add or manage jobs anytime from your dashboard.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}