// Generated code from Butter Knife. Do not modify!
package com.redimed.urgentcare;

import android.view.View;
import butterknife.ButterKnife.Finder;
import butterknife.ButterKnife.ViewBinder;

public class HomeActivity$$ViewBinder<T extends com.redimed.urgentcare.HomeActivity> implements ViewBinder<T> {
  @Override public void bind(final Finder finder, final T target, Object source) {
    View view;
    view = finder.findRequiredView(source, 2131558501, "field 'btnMakeAppointment'");
    target.btnMakeAppointment = finder.castView(view, 2131558501, "field 'btnMakeAppointment'");
    view = finder.findRequiredView(source, 2131558495, "field 'btnSportInjury'");
    target.btnSportInjury = finder.castView(view, 2131558495, "field 'btnSportInjury'");
    view = finder.findRequiredView(source, 2131558497, "field 'btnWorkInjury'");
    target.btnWorkInjury = finder.castView(view, 2131558497, "field 'btnWorkInjury'");
    view = finder.findRequiredView(source, 2131558499, "field 'btnFAQ'");
    target.btnFAQ = finder.castView(view, 2131558499, "field 'btnFAQ'");
    view = finder.findRequiredView(source, 2131558491, "field 'imgLogoRedimed'");
    target.imgLogoRedimed = finder.castView(view, 2131558491, "field 'imgLogoRedimed'");
    view = finder.findRequiredView(source, 2131558490, "field 'imgBackgroundHome'");
    target.imgBackgroundHome = finder.castView(view, 2131558490, "field 'imgBackgroundHome'");
    view = finder.findRequiredView(source, 2131558494, "field 'rippleViewSportInjury'");
    target.rippleViewSportInjury = finder.castView(view, 2131558494, "field 'rippleViewSportInjury'");
    view = finder.findRequiredView(source, 2131558496, "field 'rippleViewWorkInjury'");
    target.rippleViewWorkInjury = finder.castView(view, 2131558496, "field 'rippleViewWorkInjury'");
    view = finder.findRequiredView(source, 2131558498, "field 'rippleViewFAQ'");
    target.rippleViewFAQ = finder.castView(view, 2131558498, "field 'rippleViewFAQ'");
    view = finder.findRequiredView(source, 2131558500, "field 'rippleViewMakeAppointment'");
    target.rippleViewMakeAppointment = finder.castView(view, 2131558500, "field 'rippleViewMakeAppointment'");
  }

  @Override public void unbind(T target) {
    target.btnMakeAppointment = null;
    target.btnSportInjury = null;
    target.btnWorkInjury = null;
    target.btnFAQ = null;
    target.imgLogoRedimed = null;
    target.imgBackgroundHome = null;
    target.rippleViewSportInjury = null;
    target.rippleViewWorkInjury = null;
    target.rippleViewFAQ = null;
    target.rippleViewMakeAppointment = null;
  }
}
