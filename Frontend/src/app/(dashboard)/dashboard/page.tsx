"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Briefcase,
  FileText,
  ChevronRight,
} from "lucide-react";

import {
  getCurrentUser,
  type User,
} from "@/services/api/authApi";

import {
  getResumes,
  getResumeAnalysis,
  uploadResume,
  deleteResume,
} from "@/services/api/resumeApi";

import {
  getDashboard,
  type DashboardResponse,
} from "@/services/api/dashboardApi";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";

import ResumeList, {
  type DashboardResume,
} from "@/components/dashboard/ResumeList";

import LatestAnalysis from "@/components/dashboard/LatestAnalysis";

import ResumeUploadModal from "@/components/dashboard/ResumeUploadModal";
import DeleteResumeModal from "@/components/dashboard/DeleteResumeModal";

type ResumeAnalysis = {
  score: number;
  summary: string;
  strengths: string[];
  recommendations: string[];
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] =
    useState<User | null>(null);

  const [resumes, setResumes] =
    useState<DashboardResume[]>([]);

  const [dashboardData, setDashboardData] =
    useState<DashboardResponse | null>(null);

  const [latestAnalysis, setLatestAnalysis] =
    useState<ResumeAnalysis | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [uploadModalOpen, setUploadModalOpen] =
    useState(false);

  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);

  const [selectedResume, setSelectedResume] =
    useState<DashboardResume | null>(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const userData =
        await getCurrentUser();

      const resumesData =
        await getResumes();

      const dashboardStats =
        await getDashboard();

      const dashboardResumes =
        resumesData as DashboardResume[];

      setUser(userData);
      setResumes(dashboardResumes);
      setDashboardData(dashboardStats);

      if (dashboardResumes.length > 0) {
        const latestResume =
          dashboardResumes[0];

        try {
          const analysis =
            await getResumeAnalysis(
              latestResume.id
            );

          setLatestAnalysis(analysis);
        } catch {
          setLatestAnalysis(null);
        }
      } else {
        setLatestAnalysis(null);
      }

    } catch (error) {
      console.error(
        "Failed to load dashboard:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleUpload = async (
    file: File
  ): Promise<void> => {
    try {
      const uploadedResume =
        await uploadResume(file);

      setUploadModalOpen(false);

      router.push(
        `/resumes/${uploadedResume.id}`
      );

    } catch (error) {
      console.error(
        "Resume upload failed:",
        error
      );

      throw error;
    }
  };

  const handleDeleteRequest = (
    resume: DashboardResume
  ) => {
    setSelectedResume(resume);
    setDeleteModalOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSelectedResume(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedResume) {
      return;
    }

    const resumeId =
      selectedResume.id;

    try {
      await deleteResume(resumeId);

      setResumes((currentResumes) =>
        currentResumes.filter(
          (resume) =>
            resume.id !== resumeId
        )
      );

      if (
        resumes[0]?.id === resumeId
      ) {
        setLatestAnalysis(null);
      }

      setDeleteModalOpen(false);
      setSelectedResume(null);

      try {
        const updatedDashboard =
          await getDashboard();

        setDashboardData(
          updatedDashboard
        );
      } catch (error) {
        console.error(
          "Failed to refresh dashboard stats:",
          error
        );
      }

    } catch (error) {
      console.error(
        "Failed to delete resume:",
        error
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-paper-soft flex items-center justify-center">
        <div className="text-sm font-medium text-ink-muted">
          Loading dashboard...
        </div>
      </div>
    );
  }

  const latestResume =
    resumes[0];

  const resumeScore =
    latestAnalysis?.score ?? null;

  const completedResumes =
    resumes.filter(
      (resume) =>
        resume.processing_status
          ?.toLowerCase() ===
        "completed"
    ).length;

  return (
    <>
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-10 md:py-14">

        {/* Header */}

        <DashboardHeader
          userName={
            user?.full_name
          }
          onUpload={() =>
            setUploadModalOpen(true)
          }
        />

        {/* Stats */}

        <DashboardStats
          resumeScore={
            resumeScore
          }
          resumeCount={
            dashboardData
              ?.total_resumes ?? 0
          }
          completedCount={
            completedResumes
          }
          totalJobs={
            dashboardData
              ?.total_jobs ?? 0
          }
          totalApplications={
            dashboardData
              ?.total_applications ?? 0
          }
          interviews={
            dashboardData
              ?.interviews ?? 0
          }
          offers={
            dashboardData
              ?.offers ?? 0
          }
        />

        {/* Career Tools */}

        <section className="mb-8">

          <div className="mb-5">

            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">
              Career Tools
            </p>

            <h2 className="font-display text-2xl font-extrabold text-ink mt-1">
              Manage your job search
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            {/* Jobs */}

            <Link
              href="/jobs"
              className="group rounded-3xl bg-white border border-border-subtle shadow-sm p-6 hover:border-brand/30 hover:shadow-md transition"
            >

              <div className="flex items-center justify-between">

                <div className="h-12 w-12 rounded-2xl bg-brand/10 flex items-center justify-center">

                  <Briefcase
                    size={22}
                    className="text-brand"
                  />

                </div>

                <ChevronRight
                  size={20}
                  className="text-ink-muted group-hover:text-brand transition"
                />

              </div>

              <h3 className="font-display text-xl font-extrabold text-ink mt-5">
                Job Tracker
              </h3>

              <p className="text-sm text-ink-muted mt-2">
                Save and manage jobs you are interested in.
              </p>

              <div className="mt-5 text-2xl font-black text-brand">
                {
                  dashboardData
                    ?.total_jobs ?? 0
                }
              </div>

              <p className="text-xs text-ink-muted">
                Saved jobs
              </p>

            </Link>

            {/* Applications */}

            <Link
              href="/applications"
              className="group rounded-3xl bg-ink text-white shadow-sm p-6 hover:shadow-lg transition"
            >

              <div className="flex items-center justify-between">

                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">

                  <FileText
                    size={22}
                    className="text-brand"
                  />

                </div>

                <ChevronRight
                  size={20}
                  className="text-white/50 group-hover:text-brand transition"
                />

              </div>

              <h3 className="font-display text-xl font-extrabold mt-5">
                Applications
              </h3>

              <p className="text-sm text-white/60 mt-2">
                Track applications, interviews and offers.
              </p>

              <div className="mt-5 text-2xl font-black text-brand">
                {
                  dashboardData
                    ?.total_applications ?? 0
                }
              </div>

              <p className="text-xs text-white/50">
                Total applications
              </p>

            </Link>

          </div>

        </section>

        {/* Resume section */}

        <div className="grid lg:grid-cols-12 gap-8">

          <ResumeList
            resumes={resumes}
            onUpload={() =>
              setUploadModalOpen(
                true
              )
            }
            onDeleteRequest={
              handleDeleteRequest
            }
          />

          <LatestAnalysis
            analysis={
              latestAnalysis
            }
            resumeId={
              latestResume?.id
            }
            resumeStatus={
              latestResume
                ?.processing_status
            }
            onUpload={() =>
              setUploadModalOpen(
                true
              )
            }
          />

        </div>

      </div>

      {/* Upload modal */}

      <ResumeUploadModal
        open={uploadModalOpen}
        onClose={() =>
          setUploadModalOpen(false)
        }
        onUpload={handleUpload}
      />

      {/* Delete modal */}

      <DeleteResumeModal
        open={deleteModalOpen}
        resumeName={
          selectedResume
            ?.original_filename
        }
        onClose={
          handleDeleteCancel
        }
        onConfirm={
          handleDeleteConfirm
        }
      />
    </>
  );
}