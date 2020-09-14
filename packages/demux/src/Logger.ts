type logF = (...p: any[]) => void;

export interface Logger {
  info?: logF;
  debug?: logF;
  warn?: logF;
  error?: logF;
}
