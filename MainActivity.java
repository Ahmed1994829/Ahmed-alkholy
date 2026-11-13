package com.alkholy.a;

import android.app.Activity;
import android.os.Bundle;
import android.graphics.Color;
import android.view.Gravity;
import android.view.View;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.TextView;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewClientCompat;

public class MainActivity extends Activity {
    private WebView webView;
    private static final String START_URL =
        "https://appassets.androidplatform.net/assets/alkholy/index.html";

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        try {
            webView = new WebView(this);
            setContentView(webView);
            WebView.setWebContentsDebuggingEnabled(true);

            WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

            webView.setWebViewClient(new WebViewClientCompat() {
                @Override public android.webkit.WebResourceResponse shouldInterceptRequest(
                    WebView view, WebResourceRequest request) {
                    return loader.shouldInterceptRequest(request.getUrl());
                }

                @Override public void onReceivedError(WebView view, WebResourceRequest request,
                                                       WebResourceError error) {
                    super.onReceivedError(view, request, error);
                    if (request.isForMainFrame()) showError(
                        "تعذر فتح واجهة التطبيق. تحقق من ملفات التطبيق ثم أعد المحاولة.");
                }

                @Override public boolean onRenderProcessGone(WebView view,
                        android.webkit.RenderProcessGoneDetail detail) {
                    showError("توقف محرك عرض الصفحات في الهاتف. اضغط هنا لإعادة التشغيل.");
                    return true;
                }
            });
            webView.setWebChromeClient(new WebChromeClient());
            WebSettings settings = webView.getSettings();
            settings.setJavaScriptEnabled(true);
            settings.setDomStorageEnabled(true);
            settings.setDatabaseEnabled(true);
            settings.setLoadsImagesAutomatically(true);
            settings.setAllowFileAccess(false);
            settings.setAllowContentAccess(false);
            settings.setSupportMultipleWindows(false);
            settings.setJavaScriptCanOpenWindowsAutomatically(false);
            settings.setMediaPlaybackRequiresUserGesture(true);
            if (state == null) webView.loadUrl(START_URL);
            else webView.restoreState(state);
        } catch (Exception e) {
            showError("حدث خطأ أثناء تشغيل التطبيق: " + e.getClass().getSimpleName());
        }
    }

    private void showError(String message) {
        TextView screen = new TextView(this);
        screen.setText(message + "\n\nاضغط لإعادة المحاولة");
        screen.setTextColor(Color.WHITE);
        screen.setTextSize(18);
        screen.setGravity(Gravity.CENTER);
        screen.setPadding(32, 32, 32, 32);
        screen.setBackgroundColor(Color.rgb(7, 40, 38));
        screen.setOnClickListener(v -> {
            if (webView != null) {
                setContentView(webView);
                webView.loadUrl(START_URL);
            }
        });
        setContentView(screen);
    }

    @Override protected void onSaveInstanceState(Bundle outState) {
        if (webView != null) webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }

    @Override protected void onDestroy() {
        if (webView != null) {
            webView.stopLoading();
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
