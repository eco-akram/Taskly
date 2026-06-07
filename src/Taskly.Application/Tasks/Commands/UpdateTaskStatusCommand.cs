using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Common.DTOs;
using Taskly.Application.Interfaces;
using Taskly.Domain.Enums;

namespace Taskly.Application.Tasks.Commands;

public record UpdateTaskStatusCommand(Guid TaskId, TaskStatus Status, Guid RequesterId) : IRequest<TaskDto>;

public class UpdateTaskStatusCommandHandler(IAppDbContext db) : IRequestHandler<UpdateTaskStatusCommand, TaskDto>
{
    public async Task<TaskDto> Handle(UpdateTaskStatusCommand request, CancellationToken cancellationToken)
    {
        var task = await db.Tasks.Include(t => t.Project)
            .FirstOrDefaultAsync(t => t.Id == request.TaskId, cancellationToken)
            ?? throw new KeyNotFoundException("Task not found.");

        if (task.Project.OwnerId != request.RequesterId && task.AssigneeId != request.RequesterId)
            throw new UnauthorizedAccessException("Access denied.");

        task.ChangeStatus(request.Status);
        await db.SaveChangesAsync(cancellationToken);

        return new TaskDto(task.Id, task.Title, task.Description, task.Status.ToString(), task.Priority.ToString(), task.DueDate, task.ProjectId, task.AssigneeId, task.CreatedAt);
    }
}
