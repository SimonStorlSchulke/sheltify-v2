export type ArtickeRenderParameters = {
  uploadsUrl: string;
  formSubmissionUrl: string,
}

let articleRenderParameters: ArtickeRenderParameters | undefined = undefined;

export function setArticleRenderParameters(params: typeof articleRenderParameters) {
  articleRenderParameters = params;
}

export function getArticleRenderParameters(): ArtickeRenderParameters {
  if (!articleRenderParameters) {
    throw new Error('Article render parameters have not been set.');
  }
  return articleRenderParameters;
}