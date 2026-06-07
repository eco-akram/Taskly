using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Tasks.Commands;

public record DeleteTaskCommand(Guid TaskId, Guid RequesterId) : IRequest;

public class DeleteTaskCommandHandler(IAppDbContext db) : IRequestHandler<DeleteTaskCommand>
{
    public async Task Handle(DeleteTaskCommand request, CancellationToken cancellationToken)
    {
        var task = await db.Tasks.Include(t => t.Project)
            .FirstOrDefaultAsync(t => t.Id == request.TaskId, cancellationToken)
            ?? throw new KeyNotFoundException("Task not found.");

        if (task.Project.OwnerId != request.RequesterId)
            throw new UnauthorizedAccessException("Only the project owner can delete tasks.");

        db.Tasks.Remove(task);
        await db.SaveChangesAsync(cancellationToken);
    }
}
