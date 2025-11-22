"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Job {
  id: number;
  title: string;
  slug: string;
  department?: string;
  location?: string;
  job_type: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  salary_range?: string;
  posted_date: string;
  closing_date?: string;
}

const API_URL = "https://api.samaabysiblings.com/backend/api/v1/jobs";

export default function HiringPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setJobs(data.data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  return (
    <div className="bg-[var(--brand-light)] text-[var(--brand-dark)] min-h-screen px-6 md:px-12 py-24">
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="font-[D-DIN] text-sm md:text-base font-[var(--font-logo)] tracking-widest">
          HIRING
        </h1>
      </div>

      <div
        className={`max-w-5xl mx-auto flex gap-6 justify-center mb-12 ${
          isMobile ? "flex-col items-center" : "flex-row"
        }`}
      >
        {isMobile ? (
          <>
            <div className="flex justify-start w-full">
              <div className="relative aspect-square w-40 rounded overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922273/hiring1_klvoss.jpg"
                  alt="Hiring 1"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex justify-end w-full">
              <div className="relative aspect-square w-40 rounded overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922276/hiring2_afmvxw.jpg"
                  alt="Hiring 2"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="relative aspect-square w-48 rounded overflow-hidden">
              <Image
                src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922273/hiring1_klvoss.jpg"
                alt="Hiring 1"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square w-64 rounded overflow-hidden">
              <Image
                src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922276/hiring2_afmvxw.jpg"
                alt="Hiring 2"
                fill
                className="object-cover"
              />
            </div>
          </>
        )}
      </div>

      <div className="text-center mb-15">
        <h2 className="font-[TANTanglon] text-lg md:text-xl font-bold text-[#262626] uppercase tracking-wider">
          Come Create
        </h2>
      </div>

      <div
        className={`max-w-5xl mx-auto flex gap-6 justify-center mb-16 ${
          isMobile ? "flex-col items-center" : "flex-row"
        }`}
      >
        {isMobile ? (
          <>
            <div className="flex justify-end w-full">
              <div className="relative aspect-square w-40 rounded overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922278/hiring3_gzzoc3.jpg"
                  alt="Hiring 3"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex justify-start w-full">
              <div className="relative aspect-square w-40 rounded overflow-hidden">
                <Image
                  src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922277/hiring4_pqmdh3.jpg"
                  alt="Hiring 4"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="relative aspect-square w-64 rounded overflow-hidden">
              <Image
                src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922278/hiring3_gzzoc3.jpg"
                alt="Hiring 3"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square w-48 rounded overflow-hidden">
              <Image
                src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1752922277/hiring4_pqmdh3.jpg"
                alt="Hiring 4"
                fill
                className="object-cover"
              />
            </div>
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto text-sm md:text-base">
        {loading ? (
          <div className="border border-[#4d272e] bg-transparent p-6 text-center shadow-sm max-w-md mx-auto">
            <p className="font-[D-DIN]">Loading opportunities...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="border border-[#4d272e] bg-transparent p-6 text-center shadow-sm max-w-md mx-auto">
            <p className="mb-2 font-[D-DIN] font-semibold">No active positions</p>
            <p className="font-[D-DIN]">Check back for new opportunities</p>
          </div>
        ) : (
          <div className="grid gap-6 max-w-4xl mx-auto">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="border border-[#4d272e] bg-transparent p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-[D-DIN] text-lg font-bold mb-1">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-[#4d272e]">
                      {job.department && (
                        <span className="font-[D-DIN]">{job.department}</span>
                      )}
                      {job.location && (
                        <span className="font-[D-DIN]">• {job.location}</span>
                      )}
                      {job.job_type && (
                        <span className="font-[D-DIN]">• {job.job_type}</span>
                      )}
                    </div>
                  </div>
                  {job.salary_range && (
                    <span className="text-sm font-[D-DIN] font-semibold">
                      {job.salary_range}
                    </span>
                  )}
                </div>
                
                <p className="font-[D-DIN] text-sm mb-4 text-[#262626]/80">
                  {job.description}
                </p>

                {job.responsibilities && (
                  <div className="mb-3">
                    <h4 className="font-[D-DIN] font-semibold text-sm mb-2">
                      Responsibilities:
                    </h4>
                    <ul className="list-disc list-inside font-[D-DIN] text-sm space-y-1 text-[#262626]/80">
                      {job.responsibilities.split('\n').filter(r => r.trim()).map((resp, i) => (
                        <li key={i}>{resp.trim()}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.requirements && (
                  <div className="mb-4">
                    <h4 className="font-[D-DIN] font-semibold text-sm mb-2">
                      Requirements:
                    </h4>
                    <ul className="list-disc list-inside font-[D-DIN] text-sm space-y-1 text-[#262626]/80">
                      {job.requirements.split('\n').filter(r => r.trim()).map((req, i) => (
                        <li key={i}>{req.trim()}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#4d272e]/20">
                  <div className="text-xs font-[D-DIN] text-[#262626]/60">
                    Posted: {new Date(job.posted_date).toLocaleDateString()}
                    {job.closing_date && (
                      <span> • Closes: {new Date(job.closing_date).toLocaleDateString()}</span>
                    )}
                  </div>
                  <a
                    href={`mailto:careers@samaabysiblings.com?subject=Application for ${job.title}`}
                    className="font-[D-DIN] text-sm underline hover:text-[#4d272e] transition-colors"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="font-[D-DIN] text-center mt-16 text-xs text-[#262626]">
        <span className="capitalize">if</span> you have a great idea:{" "}
        <a
          href="mailto:careers@samaabysiblings.com"
          className="underline font-[D-DIN]"
        >
          careers@samaabysiblings.com
        </a>
      </div>
    </div>
  );
}