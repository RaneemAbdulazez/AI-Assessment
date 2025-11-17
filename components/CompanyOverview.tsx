import React, { useState } from 'react';
import ArrowRightIcon from './icons/ArrowRightIcon';
import CloseIcon from './icons/CloseIcon';

interface CompanyOverviewProps {
  onContinue: () => void;
}

const RadioGroup: React.FC<{ name: string; options: string[]; selected: string; onChange: (value: string) => void }> = ({ name, options, selected, onChange }) => (
  <div className="flex flex-wrap gap-x-8 gap-y-3">
    {options.map((option) => (
      <label key={option} className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700">
        <input
          type="radio"
          name={name}
          value={option}
          checked={selected === option}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none h-5 w-5 rounded-full border-2 border-slate-400 bg-white checked:bg-indigo-600 checked:border-indigo-600 checked:shadow-[inset_0_0_0_3px_white] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
        />
        {option}
      </label>
    ))}
  </div>
);

const CheckboxGroup: React.FC<{ options: string[]; selected: string[]; onChange: (value: string) => void; max: number }> = ({ options, selected, onChange, max }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
    {options.map((option) => (
      <label key={option} className="flex items-center gap-2.5 cursor-pointer text-sm text-slate-700">
        <input
          type="checkbox"
          value={option}
          checked={selected.includes(option)}
          onChange={() => onChange(option)}
          disabled={!selected.includes(option) && selected.length >= max}
          className="appearance-none h-5 w-5 rounded-full border-2 border-slate-400 bg-white checked:bg-indigo-600 checked:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all checked:bg-[url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\" fill=\"white\"><path d=\"M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z\"/></svg>')] bg-center bg-no-repeat"
        />
        {option}
      </label>
    ))}
  </div>
);

const CompanyOverview: React.FC<CompanyOverviewProps> = ({ onContinue }) => {
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [otherIndustry, setOtherIndustry] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [yearsInOperation, setYearsInOperation] = useState('');
  const [mainProducts, setMainProducts] = useState('');
  const [customerType, setCustomerType] = useState('');
  const [businessGoals, setBusinessGoals] = useState<string[]>([]);
  const [challenges, setChallenges] = useState('');
  const [departments, setDepartments] = useState<string[]>(['Marketing', 'Sales', 'HR']);
  const [departmentInput, setDepartmentInput] = useState('');

  const handleGoalChange = (goal: string) => {
    setBusinessGoals(prev => {
      if (prev.includes(goal)) {
        return prev.filter(g => g !== goal);
      }
      if (prev.length < 3) {
        return [...prev, goal];
      }
      return prev;
    });
  };

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    const newDept = departmentInput.trim();
    if (newDept && !departments.some(d => d.toLowerCase() === newDept.toLowerCase())) {
      setDepartments([...departments, newDept]);
      setDepartmentInput('');
    }
  };

  const handleRemoveDepartment = (deptToRemove: string) => {
    setDepartments(departments.filter(dept => dept !== deptToRemove));
  };
  
  const industries = ['Technology', 'Professional Services', 'Real Estate', 'Healthcare', 'Retail', 'Manufacturing', 'Education', 'Non-Profit'];
  const teamSizes = ['1–5', '6–15', '16–50', '51–200', '200+'];
  const yearsOptions = ['<1', '1–3', '4–7', '8–15', '16+'];
  const customerTypes = ['B2B', 'B2C', 'Government', 'Internal (shared services)'];
  const goals = ['Increase revenue', 'Improve efficiency', 'Enhance customer experience', 'Expand into new markets', 'Innovate products/services', 'Strengthen compliance'];
  
  const inputClasses = "block w-full rounded-md border-0 py-2.5 px-3.5 bg-slate-800 text-slate-100 ring-1 ring-inset ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition";
  const labelClasses = "block text-sm font-medium leading-6 text-slate-800 mb-2";

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 w-full max-w-3xl">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
        Step 1: Company Overview
      </h1>
      <p className="text-slate-600 text-md mb-10">
        Let's start with some basic information about your organization.
      </p>

      <form onSubmit={(e) => { e.preventDefault(); onContinue(); }} className="space-y-8">
        <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Company Details</h3>
            <div className="space-y-6">
                <div>
                    <label htmlFor="company-name" className={labelClasses}>Company Name</label>
                    <input type="text" id="company-name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputClasses} />
                </div>
                <div>
                    <label className={labelClasses}>Industry</label>
                    <RadioGroup name="industry" options={[...industries, 'Other']} selected={industry} onChange={setIndustry} />
                    {industry === 'Other' && (
                    <input type="text" value={otherIndustry} onChange={(e) => setOtherIndustry(e.target.value)} placeholder="Please specify your industry" className={`${inputClasses} mt-3 sm:w-1/2`} />
                    )}
                </div>
                <div>
                    <label className={labelClasses}>Team Size</label>
                    <RadioGroup name="team-size" options={teamSizes} selected={teamSize} onChange={setTeamSize} />
                </div>
                <div>
                    <label className={labelClasses}>Years in Operation</label>
                    <RadioGroup name="years-in-operation" options={yearsOptions} selected={yearsInOperation} onChange={setYearsInOperation} />
                </div>
            </div>
        </div>

        <hr className="border-slate-200" />
        
        <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Business Focus</h3>
            <div className="space-y-6">
                <div>
                    <label htmlFor="main-products" className={labelClasses}>Main Products or Services</label>
                    <textarea id="main-products" value={mainProducts} onChange={(e) => setMainProducts(e.target.value)} rows={3} className={inputClasses}></textarea>
                </div>
                <div>
                    <label className={labelClasses}>Primary Customer Type</label>
                    <RadioGroup name="customer-type" options={customerTypes} selected={customerType} onChange={setCustomerType} />
                </div>
                <div>
                    <label className={labelClasses}>Top 3 Business Goals for the Next 3 Years</label>
                    <CheckboxGroup options={goals} selected={businessGoals} onChange={handleGoalChange} max={3} />
                </div>
            </div>
        </div>

        <hr className="border-slate-200" />

        <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Operations</h3>
            <div className="space-y-6">
                <div>
                <label htmlFor="main-challenges" className={labelClasses}>Main Operational Challenges or Pain Points</label>
                <textarea id="main-challenges" value={challenges} onChange={(e) => setChallenges(e.target.value)} rows={3} className={inputClasses}></textarea>
                </div>
                <div>
                <label htmlFor="department-input" className={labelClasses}>Departments</label>
                <div className="flex items-center gap-2">
                    <input type="text" id="department-input" value={departmentInput} onChange={(e) => setDepartmentInput(e.target.value)} placeholder="e.g., Finance" className={inputClasses} />
                    <button type="button" onClick={handleAddDepartment} className="px-4 py-2.5 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300 whitespace-nowrap transition-colors">Add</button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                    {departments.map(dept => (
                    <div key={dept} className="bg-slate-200 text-slate-800 text-sm font-medium pl-3 pr-2 py-1 rounded-full flex items-center gap-2 transition-all">
                        <span>{dept}</span>
                        <button type="button" onClick={() => handleRemoveDepartment(dept)} aria-label={`Remove ${dept}`} className="rounded-full hover:bg-slate-300 p-0.5 transition-colors">
                        <CloseIcon className="w-3.5 h-3.5 text-slate-600" />
                        </button>
                    </div>
                    ))}
                </div>
                </div>
            </div>
        </div>

        <div className="mt-12 text-right">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105"
          >
            <span>Save & Continue</span>
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyOverview;
