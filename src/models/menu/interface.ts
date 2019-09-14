export interface IMenu {
  name: string;
  path: string;
  icon?: string;
  children?: IMenu[];
  collapsed?: boolean;
  sort?: number;
  iframe: string;
  parent: IMenu | null;
  code: string;
}
