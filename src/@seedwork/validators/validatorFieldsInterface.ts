export type FielsErrors = {
  [key: string]: string[];
};

export interface ValidatorFieldsInterface<PropsValidate> {
  errors: FielsErrors;
  validatedData: PropsValidate;
  validate(data: any): boolean

}
