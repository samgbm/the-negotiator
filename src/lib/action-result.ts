export type ActionError = {
  code: string;
  message: string;
};

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: ActionError };

export function actionOk<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

export function actionFail(
  code: string,
  message: string,
): ActionResult<never> {
  return { success: false, error: { code, message } };
}
