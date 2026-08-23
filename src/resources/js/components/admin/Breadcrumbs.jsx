import { useTranslation } from 'react-i18next';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { breadcrumbRoutes } from '../../data/breadcrumbRoutes';

const routesByPath = new Map(
    breadcrumbRoutes.map((route) => [route.path, route])
);

function buildBreadcrumbs(route) {
    const breadcrumbs = [];
    const visitedPaths = new Set();
    let currentRoute = route;

    while (currentRoute && !visitedPaths.has(currentRoute.path)) {
        breadcrumbs.unshift(currentRoute);
        visitedPaths.add(currentRoute.path);
        currentRoute = currentRoute.parent
            ? routesByPath.get(currentRoute.parent)
            : null;
    }

    return breadcrumbs;
}

export default function Breadcrumbs({ currentLabel, className = '' }) {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const currentRoute = breadcrumbRoutes.find((route) =>
        matchPath({ path: route.path, end: true }, pathname)
    );

    if (!currentRoute) {
        return null;
    }

    const breadcrumbs = buildBreadcrumbs(currentRoute);

    return (
        <nav
            className={`text-[11px] font-[760] uppercase tracking-[0.09em] text-[color:var(--color-accent)] ${className}`.trim()}>
            <ol className="m-0 flex list-none items-center gap-1 p-0">
                {breadcrumbs.map((breadcrumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    const label = isLast && currentLabel
                        ? currentLabel
                        : t(breadcrumb.labelKey);

                    return (
                        <li key={breadcrumb.path} className="flex min-w-0 items-center gap-1">
                            {index > 0 && <span aria-hidden="true">/</span>}
                            {isLast ? (
                                <span className="truncate" aria-current="page">{label}</span>
                            ) : (
                                <Link className="truncate text-inherit no-underline" to={breadcrumb.path}>
                                    {label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
