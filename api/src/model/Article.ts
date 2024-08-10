export default interface Article {
  ArticleId: string;
  Title: string;
  Description: string | undefined;
  Author: string;
  Attachments: string[] | undefined;
  CreatedAt: string;
  UpdatedAt: string;
}
