using MediatR;
using Microsoft.EntityFrameworkCore;
using Taskly.Application.Common.DTOs;
using Taskly.Application.Interfaces;

namespace Taskly.Application.Projects.Queries;

public record GetProjectsQuery(Guid OwnerId) : IRequest<List<ProjectDto>>;

public class GetProjectsQueryHandler(IAppDbContext db) : IRequestHandler<GetProjectsQuery, List<ProjectDto>>
{
    public async Task<List<ProjectDto>> Handle(GetProjectsQuery request, CancellationToken cancellationToken)
        => await db.Projects
            .Where(p => p.OwnerId == request.OwnerId)
            .Include(p => p.Tasks)
            .Select(p => new ProjectDto(p.Id, p.Name, p.Description, p.CreatedAt, p.Tasks.Count))
            .ToListAsync(cancellationToken);
}
