export type FieldsErrors = {
  [key: string]: string[];
};

export interface ValidatorFieldsInterface<PropsValidate> {
  errors: FieldsErrors;
  validatedData: PropsValidate;
  validate(data: any): boolean

}
