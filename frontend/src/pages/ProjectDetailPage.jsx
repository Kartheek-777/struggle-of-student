import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Code, GitBranch, ExternalLink, User, Layers, CheckCircle2, 
  ArrowLeft, Calendar, Tag, ShieldCheck, AlertCircle 
} from 'lucide-react';
import { getProjectDetail } from '../services/api';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjectDetail();
  }, [id]);

  const fetchProjectDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProjectDetail(id);
      setProject(res.data);
    } catch (err) {
      setError("Project not found or is currently private.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen py-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The requested project could not be found."}</p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-xl font-medium hover:bg-[#2563EB]/90 transition-colors"
          >
            <ArrowLeft size={18} /> Back to Student Projects
          </Link>
        </div>
      </div>
    );
  }

  const techList = project.technologies ? project.technologies.split(',').map(t => t.trim()) : [];
  const featureList = project.features ? project.features.split('\n').filter(f => f.trim()) : [];

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back navigation */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#2563EB] mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Projects
        </Link>

        {/* Hero Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider bg-[#1D4ED8]/10 px-3 py-1 rounded-md">
              {project.category_name || 'Project'}
            </span>
            <span className="bg-[#2563EB]/10 text-[#2563EB] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              Status: {project.status_display || project.project_status}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-3">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-2">
              <User size={16} className="text-[#2563EB]" />
              <span>Lead: <strong className="text-gray-800">{project.owner_name}</strong></span>
            </div>
            {project.created_at && (
              <div className="flex items-center gap-1.5">
                <Calendar size={16} className="text-gray-400" />
                <span>Submitted: {new Date(project.created_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* External Links CTA */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-colors"
              >
                <GitBranch size={18} /> GitHub Repository
              </a>
            )}
            {project.live_demo_url && (
              <a
                href={project.live_demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white rounded-xl text-sm font-semibold hover:bg-[#2563EB]/90 transition-colors"
              >
                <ExternalLink size={18} /> View Live Demo
              </a>
            )}
            {project.portfolio_url && (
              <a
                href={project.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-800 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                <ExternalLink size={18} /> Portfolio Link
              </a>
            )}
          </div>
        </div>

        {/* Project Cover Image */}
        {project.image_url && (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-8">
            <img 
              src={project.image_url} 
              alt={project.title} 
              className="w-full max-h-[450px] object-cover" 
            />
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview & Description */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                <Layers size={20} className="text-[#2563EB]" /> Project Overview
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                {project.description}
              </p>
            </div>

            {/* Problem Statement */}
            {project.problem_statement && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-[#0F172A] mb-4 text-amber-700">
                   The Problem Statement
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                  {project.problem_statement}
                </p>
              </div>
            )}

            {/* Solution */}
            {project.solution && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-[#0F172A] mb-4 text-[#2563EB]">
                   The Proposed Solution
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                  {project.solution}
                </p>
              </div>
            )}

            {/* Key Features */}
            {featureList.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-[#0F172A] mb-4">
                   Key Features
                </h2>
                <ul className="space-y-3">
                  {featureList.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <CheckCircle2 size={18} className="text-[#2563EB] shrink-0 mt-1" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar Info (Right 1 col) */}
          <div className="space-y-8">
            {/* Tech Stack */}
            {techList.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                  <Code size={18} className="text-[#2563EB]" /> Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {techList.map((tech, idx) => (
                    <span 
                      key={idx} 
                      className="bg-[#2563EB]/5 border border-[#2563EB]/10 text-[#2563EB] px-3 py-1.5 rounded-lg font-mono text-xs font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Team Members */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                <User size={18} className="text-[#2563EB]" /> Project Team
              </h3>
              <div className="space-y-4">
                {/* Project Owner */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm">
                    {project.owner_name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{project.owner_name}</h4>
                    <span className="text-xs text-[#2563EB] font-medium">Project Owner / Lead</span>
                  </div>
                </div>

                {/* Additional Team Members */}
                {project.team_members && project.team_members.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-bold text-sm">
                      {member.student_name?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{member.student_name}</h4>
                      <span className="text-xs text-gray-500">{member.role || 'Contributor'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Authenticity Note */}
            <div className="bg-[#2563EB]/5 rounded-2xl p-6 border border-[#2563EB]/10">
              <div className="flex items-center gap-2 text-[#2563EB] font-bold text-sm mb-2">
                <ShieldCheck size={18} /> Verified SS Student Project
              </div>
              <p className="text-xs text-gray-600">
                This project was created and submitted by real student community members on Struggle of Student.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
