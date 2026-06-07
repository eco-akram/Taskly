using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Common.DTOs;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Projects.Commands;

public record UpdateProjectCommand(Guid Id, string Name, string? Description, Guid RequesterId) : IRequest<ProjectDto>;

public class UpdateProjectCommandHandler(IAppDbContext db) : IRequestHandler<UpdateProjectCommand, ProjectDto>
{
    public async Task<ProjectDto> Handle(UpdateProjectCommand request, CancellationToken cancellationToken)
    {
        var project = await db.Projects.Include(p => p.Tasks)
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException("Project not found.");

        if (project.OwnerId != request.RequesterId)
            throw new UnauthorizedAccessException("Only the owner can update this project.");

        project.Update(request.Name, request.Description);
        await db.SaveChangesAsync(cancellationToken);
        return new ProjectDto(project.Id, project.Name, project.Description, project.CreatedAt, project.Tasks.Count);
    }
}
