import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindTasksQueryDto } from './dto/find-tasks-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    const project = await this.prisma.project.findUnique({
      where: {
        id: createTaskDto.projectId,
      },
    });

    if (!project) {
      throw new NotFoundException(
        `Project with id "${createTaskDto.projectId}" was not found.`,
      );
    }

    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
      },
    });
  }

  async findAll(query: FindTasksQueryDto) {
    const where: Prisma.TaskWhereInput = {
      projectId: query.projectId,
      status: query.status,
      priority: query.priority,
    };

    return await this.prisma.task.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with id "${id}" was not found.`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    await this.findOne(id);

    if (updateTaskDto.projectId) {
      const project = await this.prisma.project.findUnique({
        where: {
          id: updateTaskDto.projectId,
        },
      });

      if (!project) {
        throw new NotFoundException(
          `Project with id "${updateTaskDto.projectId}" was not found.`,
        );
      }
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        ...updateTaskDto,
        dueDate: updateTaskDto.dueDate
          ? new Date(updateTaskDto.dueDate)
          : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.task.delete({
      where: { id },
    });
  }
}
