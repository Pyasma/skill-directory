"use server";

import prisma from "@/db/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSections } from "@/lib/get-skills";
 
export async function deleteProjectAction(projectId: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Not authenticated" };
    }

    // Ensure the project belongs to the user before deleting
    const project = await prisma.projects.findFirst({
      where: { id: projectId, userId: user.id }
    });

    if (!project) {
      return { success: false, error: "Project not found or unauthorized" };
    }

    await prisma.projects.delete({
      where: { id: projectId }
    });

    return { success: true };
  } catch (err: any) {
    console.error("Delete project error:", err);
    return { success: false, error: err.message || "Failed to delete project" };
  }
}


export async function uploadSkillsAction(markdown: string, skillName: string, projectName: string = "Core Skills") {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Not authenticated" };
    }

    if (!markdown.trim()) {
      return { success: false, error: "Markdown file is empty." };
    }

    // Find or create project record for user
    let project = await prisma.projects.findFirst({
      where: { userId: user.id, projectName },
    });

    if (!project) {
      project = await prisma.projects.create({
        data: {
          userId: user.id,
          projectName,
          description: `Project ${projectName}`,
        },
      });
    }

    // Find if skill already exists in project and update it, or create it.
    const existingSkill = await prisma.skills.findFirst({
      where: { skillName, projects: { some: { id: project.id } } }
    });

    if (existingSkill) {
      await prisma.skills.update({
        where: { id: existingSkill.id },
        data: { content: markdown }
      });
    } else {
      await prisma.skills.create({
        data: {
          userId: user.id,
          skillName,
          content: markdown,
          projects: { connect: { id: project.id } },
        }
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to upload skills:", error);
    return { success: false, error: error.message || "Failed to upload skills" };
  }
}

export async function createProjectAction(projectName: string, description: string = "") {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Not authenticated" };
    }

    let project = await prisma.projects.findFirst({
      where: { userId: user.id, projectName },
    });

    if (!project) {
      project = await prisma.projects.create({
        data: {
          userId: user.id,
          projectName,
          description: description || `Project ${projectName}`,
        },
      });

      // Give it an initial skill file
      await prisma.skills.create({
        data: {
          userId: user.id,
          skillName: "overview.md",
          content: `# ${projectName} Overview\n\nWelcome to your new project!`,
          projects: { connect: { id: project.id } },
        },
      });
    }

    return { success: true, project: { id: project.projectName, projectName: project.projectName } };
  } catch (error: any) {
    console.error("Failed to create project:", error);
    return { success: false, error: error.message || "Failed to create project" };
  }
}

export async function addSkillToProjectAction(projectName: string, skillName: string, content: string = "") {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Not authenticated" };
    }

    let project = await prisma.projects.findFirst({
      where: { userId: user.id, projectName },
    });

    if (!project) {
      project = await prisma.projects.create({
        data: {
          userId: user.id,
          projectName,
          description: `Project ${projectName}`,
        },
      });
    }

    const formattedSkillName = skillName.endsWith(".md") ? skillName : `${skillName}.md`;

    await prisma.skills.create({
      data: {
        userId: user.id,
        skillName: formattedSkillName,
        content: content || `# ${skillName}\n\nAdd your content here.`,
        projects: { connect: { id: project.id } },
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Failed to add skill:", error);
    return { success: false, error: error.message || "Failed to add skill" };
  }
}

export async function getProjectsAction() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Not authenticated", projects: [] };
    }

    let projects = await prisma.projects.findMany({
      where: { userId: user.id },
      include: { skills: { select: { id: true, skillName: true } } },
      orderBy: { createdAt: "asc" },
    });

    // Seed default projects if DB table is empty
    if (projects.length === 0) {
      await createProjectAction("Core Skills", "Default set of core skills");
      // DEFAULT_FILES was removed, so we only create the project
      projects = await prisma.projects.findMany({
        where: { userId: user.id },
        include: { skills: { select: { id: true, skillName: true } } },
        orderBy: { createdAt: "asc" },
      });
    }

    return {
      success: true,
      projects: projects.map((p) => ({
        id: p.projectName,
        projectName: p.projectName,
        skillsCount: p.skills.length,
        skills: p.skills.map((s) => s.skillName),
      })),
    };
  } catch (error: any) {
    console.error("Failed to get projects:", error);
    return { success: false, error: error.message, projects: [] };
  }
}

export async function getSkillsAction(projectName: string, skillName: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Not authenticated" };
    }

    // Find the specific project in DB
    const project = await prisma.projects.findFirst({
      where: { userId: user.id, projectName },
      include: { 
        skills: { 
          where: { skillName }
        } 
      },
    });

    if (!project || project.skills.length === 0) {
      return { success: true, markdown: "" };
    }

    const markdown = project.skills[0].content;
    return { success: true, markdown };
  } catch (error: any) {
    console.error("Failed to get skill:", error);
    return { success: false, error: error.message || "Failed to retrieve skill" };
  }
}
