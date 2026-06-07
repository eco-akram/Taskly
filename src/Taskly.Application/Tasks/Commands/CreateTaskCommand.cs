using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Common.DTOs;
using Taskly.Application.Interfaces;
using Taskly.Domain.Entities;
using Taskly.Domain.Enums;

namespace Taskly.Application.Tasks.Commands;

public record CreateTaskCommand(string Title, string? Description, TaskPriority Priority, DateTime? DueDate, Guid ProjectId, Guid RequesterId, Guid? AssigneeId = null) : IRequest<TaskDto>;

public class CreateTaskCommandHandler(IAppDbContext db) : IRequestHandler<CreateTaskCommand, TaskDto>
{
    public async Task<TaskDto> Handle(CreateTaskCommand request, CancellationToken cancellationToken)
    {
        var project = await db.Projects.FirstOrDefaultAsync(p => p.Id == request.ProjectId, cancellationToken)
            ?? throw new KeyNotFoundException("Project not found.");

        if (project.OwnerId != request.RequesterId)
            throw new UnauthorizedAccessException("Only the project owner can add tasks.");

        var task = TaskItem.Create(request.Title, request.Description, request.Priority, request.DueDate, request.ProjectId, request.AssigneeId);
        db.Tasks.Add(task);
        await db.SaveChangesAsync(cancellationToken);

        return new TaskDto(task.Id, task.Title, task.Description, task.Status.ToString(), task.Priority.ToString(), task.DueDate, task.ProjectId, task.AssigneeId, task.CreatedAt);
    }
}
