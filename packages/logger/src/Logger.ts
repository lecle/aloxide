type loggerF = (...p: any) => void;
export interface Logger {
  debug?: loggerF;
  info?: loggerF;
  warn?: loggerF;
  error?: loggerF;
}
