// Generated code from Butter Knife. Do not modify!
package patient.telehealth.redimed.workinjury;

import android.view.View;
import butterknife.ButterKnife.Finder;
import butterknife.ButterKnife.ViewBinder;

public class FAQsActivity$$ViewBinder<T extends patient.telehealth.redimed.workinjury.FAQsActivity> implements ViewBinder<T> {
  @Override public void bind(final Finder finder, final T target, Object source) {
    View view;
    view = finder.findRequiredView(source, 2131492988, "field 'webViewFAQs'");
    target.webViewFAQs = finder.castView(view, 2131492988, "field 'webViewFAQs'");
    view = finder.findRequiredView(source, 2131492986, "field 'btnBack'");
    target.btnBack = finder.castView(view, 2131492986, "field 'btnBack'");
  }

  @Override public void unbind(T target) {
    target.webViewFAQs = null;
    target.btnBack = null;
  }
}
