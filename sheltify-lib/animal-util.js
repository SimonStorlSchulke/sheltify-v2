export function animalsByArticleId(animals) {
    return animals.reduce((acc, animal) => {
        animal.ArticleID ??= 'NoArticle';
        acc[animal.ArticleID] = acc[animal.ArticleID] ?? [];
        acc[animal.ArticleID].push(animal);
        return acc;
    }, {});
}
