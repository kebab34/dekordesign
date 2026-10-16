// Nom affiché sur les cartes : partie après « Série - » du nom complet, sinon le nom court
export const fullNameSuffix = p => p.fullName.split(' - ').slice(1).join(' - ') || p.name;
