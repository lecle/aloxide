type loggerF = (...p: any) => void;
export interface Logger {
  log?: loggerF;
  info?: loggerF;
  debug?: loggerF;
  warn?: loggerF;
  error?: loggerF;
}
