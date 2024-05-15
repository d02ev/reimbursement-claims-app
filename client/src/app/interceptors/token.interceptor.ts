import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
	const accessToken = inject(AuthService).getAccessToken();
	const excludedUrls = ['/register', '/login'];
	const reqUrlContainsExcludedUrl = excludedUrls.some((url) =>
		req.url.includes(url),
	);

	if (accessToken && !reqUrlContainsExcludedUrl) {
		const reqWithAuthHeader = req.clone({
			setHeaders: { Authorization: `Bearer ${accessToken}` },
		});

		return next(reqWithAuthHeader);
	}
	return next(req);
};
