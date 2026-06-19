export const owners = process.env.OWNER_IDS
    ? process.env.OWNER_IDS.split(',').map(id => id.trim())
    : [];

export function isOwner(userId) {
    return owners.includes(userId);
}