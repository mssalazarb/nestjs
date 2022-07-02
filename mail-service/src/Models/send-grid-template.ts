export class SendGridTemplate {
  from: string;
  to: string;
  subject: string;
  template_id: string;
  template_data: { [key: string]: any };
}
