package patient.telehealth.redimed.sportinjury.network;

import android.content.Context;
import android.util.Log;
import com.squareup.okhttp.OkHttpClient;
import java.util.concurrent.TimeUnit;
import patient.telehealth.redimed.sportinjury.api.UrgentRequest;
import patient.telehealth.redimed.sportinjury.utils.Config;
import patient.telehealth.redimed.sportinjury.utils.RetrofitErrorHandler;
import retrofit.RequestInterceptor;
import retrofit.RestAdapter;
import retrofit.client.OkClient;

public class RESTClient {
    private static RestAdapter restAdapter;
    private static OkHttpClient okHttpClient;
    private static Context context;

    public static void InitRESTClient(Context ctx) {
        context = ctx;
        setupRestClient();
    }

    private static void setupRestClient() {
        okHttpClient = new OkHttpClient();
        okHttpClient.setReadTimeout(30, TimeUnit.SECONDS);
        okHttpClient.setConnectTimeout(30, TimeUnit.SECONDS);

        restAdapter = new RestAdapter.Builder()
                .setLogLevel(RestAdapter.LogLevel.BASIC)
                .setEndpoint(Config.apiURL)
                .setClient(new OkClient(okHttpClient))
                .setRequestInterceptor(new SessionRequestInterceptor())
                .setErrorHandler(new RetrofitErrorHandler())
                .build();
    }

    private static class SessionRequestInterceptor implements RequestInterceptor {
        public void intercept(RequestFacade paramRequestFacade) {
            paramRequestFacade.addHeader("Accept", "application/json");
            paramRequestFacade.addHeader("Content-Type", "application/json");
            paramRequestFacade.addHeader("Version", "1.0");
        }
    }

    public static UrgentRequest getRegisterApi() {
        return restAdapter.create(UrgentRequest.class);
    }

}


