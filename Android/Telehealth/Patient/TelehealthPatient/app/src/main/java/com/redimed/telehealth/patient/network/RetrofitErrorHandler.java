package com.redimed.telehealth.patient.network;

import android.content.Context;
import android.util.Log;

import org.json.JSONObject;

import java.net.ConnectException;
import java.net.SocketTimeoutException;
import java.net.UnknownHostException;

import retrofit.ErrorHandler;
import retrofit.RetrofitError;
import retrofit.mime.TypedByteArray;

/**
 * Created by Lam on 10/20/2015.
 */
public class RetrofitErrorHandler implements ErrorHandler {

    private static final String TAG = "===RETROFIT_ERROR===";

    public RetrofitErrorHandler(Context ctx) {
    }

    @Override
    public Throwable handleError(RetrofitError cause) {
        String errorDescription;
        if (cause.getCause() instanceof ConnectException || cause.getCause() instanceof UnknownHostException) {
            errorDescription = "Network Error";
        } else if (cause.getCause() instanceof SocketTimeoutException) {
            errorDescription = "Network Timeout";
        } else {
            if (cause.getResponse() == null) {
                errorDescription = "No Response From Server";
            } else {
                try {
                    ErrorResponse errorResponse = (ErrorResponse) cause.getBodyAs(ErrorResponse.class);
                    errorDescription = errorResponse.error.data.message;
                } catch (Exception ex) {
                    try {
                        String json = new String(((TypedByteArray) cause.getResponse().getBody()).getBytes());
                        JSONObject dataObject = new JSONObject(json);
                        String strError = dataObject.opt("ErrorsList") == null ? dataObject.opt("ErrorType").toString() : dataObject.opt("ErrorsList").toString();
                        if (strError.equalsIgnoreCase("[\"isAuthenticated.notAuthenticated\"]") || strError.equalsIgnoreCase("[\"isAuthenticated.oldRefreshCodeExpired\"]")) {
                            errorDescription = "TokenExpiredError";
                        } else if (strError.equalsIgnoreCase("[\"isAuthenticated.sessionUserMismatchedUserAccess\"]")) {
                            errorDescription = "Session Mismatched, please refresh again!";
                        } else {
                            errorDescription = strError;
                        }
                    } catch (Exception ex2) {
                        Log.e(TAG, "HandleError: " + ex2.getLocalizedMessage());
                        errorDescription = "Error Unknown";
                    }
                }
            }
        }
        return new Exception(errorDescription);
    }
}

class ErrorResponse {
    Error error;

    public static class Error {
        Data data;

        public static class Data {
            String message;
        }
    }
}
