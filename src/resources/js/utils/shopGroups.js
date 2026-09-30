export function buildShopGroupOptions(groups) {
    const ids = new Set(groups.map((group) => group.id));
    const children = new Map();

    for (const group of groups) {
        const parentId = ids.has(group.parent_id) ? group.parent_id : null;
        if (!children.has(parentId)) children.set(parentId, []);
        children.get(parentId).push(group);
    }

    const options = [];
    const visited = new Set();
    const visit = (group, path = []) => {
        if (visited.has(group.id)) return;
        visited.add(group.id);

        const names = [...path, group.name];
        options.push({
            ...group,
            value: group.id,
            label: names.join(' → '),
            depth: path.length,
            type: children.has(group.id) ? 'parent' : 'leaf',
            expanded: true,
        });

        for (const child of children.get(group.id) ?? []) visit(child, names);
    };

    for (const group of children.get(null) ?? []) visit(group);
    // Keep every category selectable even if legacy data contains a missing parent or cycle.
    for (const group of groups) visit(group);

    return options;
}
