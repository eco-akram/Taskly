using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Common.DTOs;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Projects.Queries;

public record GetProjectByIdQuery(Guid Id, Guid RequesterId) : IRequest<ProjectDto>;

public class GetProjectByIdQueryHandler(IAppDbContext db) : IRequestHandler<GetProjectByIdQuery, ProjectDto>
{
    public async Task<ProjectDto> Handle(GetProjectByIdQuery request, CancellationToken cancellationToken)
    {
        var project = await db.Projects
            .Include(p => p.Tasks)
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken)
            ?? throw new KeyNotFoundException("Project not found.");

        if (project.OwnerId != request.RequesterId)
            throw new UnauthorizedAccessException("Access denied.");

        return new ProjectDto(project.Id, project.Name, project.Description, project.CreatedAt, project.Tasks.Count);
    }
}
