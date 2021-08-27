import { AuthenticatedRequest } from '../../../api/authenticated/router';

export function mockRequest(props?: Partial<AuthenticatedRequest>): AuthenticatedRequest {
  return (props ?? {}) as AuthenticatedRequest;
}
