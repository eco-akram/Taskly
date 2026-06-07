using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Projects.Commands;

public record DeleteProjectCommand(Guid Id, Guid RequesterId) : IRequest;

public class DeleteProjectCommandHandler(IAppDbContext db) : IRequestHandler<DeleteProjectCommand>
{
    public async Task Handle(DeleteProjectCommand request, CancellationToken cancellationToken)
    {
        var project = await db.Projects.FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException("Project not found.");

        if (project.OwnerId != request.RequesterId)
            throw new UnauthorizedAccessException("Only the owner can delete this project.");

        db.Projects.Remove(project);
        await db.SaveChangesAsync(cancellationToken);
    }
}
