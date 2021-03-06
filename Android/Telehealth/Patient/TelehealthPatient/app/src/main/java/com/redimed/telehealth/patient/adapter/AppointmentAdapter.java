package com.redimed.telehealth.patient.adapter;

import android.content.Context;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.support.v7.widget.RecyclerView.ViewHolder;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.redimed.telehealth.patient.MyApplication;
import com.redimed.telehealth.patient.R;
import com.redimed.telehealth.patient.main.presenter.IMainPresenter;
import com.redimed.telehealth.patient.main.presenter.MainPresenter;
import com.redimed.telehealth.patient.models.Appointment;
import com.redimed.telehealth.patient.models.Doctor;
import com.redimed.telehealth.patient.appointment_tabs.TabsAppointmentFragment;
import com.redimed.telehealth.patient.utlis.EndlessRecyclerOnScrollListener;

import java.util.List;

import butterknife.Bind;
import butterknife.ButterKnife;

/**
 * Created by Lam on 10/30/2015.
 */
public class AppointmentAdapter extends RecyclerView.Adapter<ViewHolder> {

    private final int VIEW_ITEM = 1;
    private final int VIEW_PROG = 0;

    // The minimum amount of items to have below your current scroll position
    // before loading more.
    private boolean loading;
    private int visibleThreshold = 10;
    private int lastVisibleItem, totalItemCount;
    private EndlessRecyclerOnScrollListener onLoadMoreListener;

    private Context context;
    private int lastPosition;
    private IMainPresenter iMainPresenter;
    private List<Appointment> listAppointment;
    private static final String TAG = "=====AppointmentAdapter=====";

    public AppointmentAdapter(Context context, List<Appointment> data, FragmentActivity fragmentActivity, RecyclerView recyclerView) {
        this.context = context;
        this.listAppointment = data;

        iMainPresenter = new MainPresenter(context, fragmentActivity);

        if (recyclerView.getLayoutManager() instanceof LinearLayoutManager) {
            final LinearLayoutManager linearLayoutManager = (LinearLayoutManager) recyclerView.getLayoutManager();
            recyclerView.addOnScrollListener(new RecyclerView.OnScrollListener() {
                @Override
                public void onScrolled(RecyclerView recyclerView, int dx, int dy) {
                    super.onScrolled(recyclerView, dx, dy);

                    totalItemCount = linearLayoutManager.getItemCount();
                    lastVisibleItem = linearLayoutManager.findLastVisibleItemPosition();
                    if (!loading && totalItemCount <= (lastVisibleItem + visibleThreshold)) {

                        // End has been reached
                        // Do something
                        if (onLoadMoreListener != null) {
                            onLoadMoreListener.onLoadMore();
                        }
                        loading = true;
                    }
                }
            });
        }
    }

    public class AppointmentViewHolder extends RecyclerView.ViewHolder {
        @Bind(R.id.lblDate)
        TextView lblDate;
        @Bind(R.id.lblDoctorRef)
        TextView lblDoctorRef;
        @Bind(R.id.lblDoctorPre)
        TextView lblDoctorPre;

        public AppointmentViewHolder(final View itemView) {
            super(itemView);
            ButterKnife.bind(this, itemView);
            itemView.setClickable(true);
            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    SubTracking(getAdapterPosition());
                }
            });
        }
    }

    public class ProgressViewHolder extends RecyclerView.ViewHolder {
        @Bind(R.id.progressBar)
        ProgressBar progressBar;

        public ProgressViewHolder(View v) {
            super(v);
            ButterKnife.bind(this, v);
        }
    }

    private void SubTracking(int position) {
        Bundle bundle = new Bundle();
        bundle.putString("apptUID", listAppointment.get(position).getUID());
        Fragment fragment = new TabsAppointmentFragment();
        fragment.setArguments(bundle);

        iMainPresenter.replaceFragment(fragment);
    }

    @Override
    public int getItemViewType(int position) {
        return listAppointment.get(position) != null ? VIEW_ITEM : VIEW_PROG;
    }

    public void setLoaded() {
        loading = false;
    }

    @Override
    public int getItemCount() {
        return listAppointment.size();
    }

    public void setOnLoadMoreListener(EndlessRecyclerOnScrollListener onLoadMoreListener) {
        this.onLoadMoreListener = onLoadMoreListener;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        RecyclerView.ViewHolder vh;
        if (viewType == VIEW_ITEM) {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.cardview_list_appointment, parent, false);
            vh = new AppointmentViewHolder(v);
        } else {
            View v = LayoutInflater.from(parent.getContext()).inflate(R.layout.progress_item, parent, false);
            vh = new ProgressViewHolder(v);
        }
        return vh;
    }

    @Override
    public void onBindViewHolder(ViewHolder viewHolder, int position) {
        if (viewHolder instanceof AppointmentViewHolder) {
            AppointmentViewHolder appointmentViewHolder = (AppointmentViewHolder) viewHolder;

            String refName = "";
            if (listAppointment.get(position).getTelehealthAppointment() != null) {
                refName = listAppointment.get(position).getTelehealthAppointment().getRefName() == null ? "NONE" : listAppointment.get(position).getTelehealthAppointment().getRefName();
            }

            /* Show data Created Date, Referring, Preferred */
            appointmentViewHolder.lblDate.setText(MyApplication.getInstance().ConvertDate(listAppointment.get(position).getCreatedDate()));
            appointmentViewHolder.lblDoctorRef.setText(refName);
            appointmentViewHolder.lblDoctorPre.setText(GetDoctorName(position));

//            Animation animation = AnimationUtils.loadAnimation(context,
//                    (position > lastPosition) ? R.anim.up_from_bottom : R.anim.down_from_top);
//            appointmentViewHolder.itemView.startAnimation(animation);
//            lastPosition = position;
        } else {
            ((ProgressViewHolder) viewHolder).progressBar.setIndeterminate(true);
        }
    }

    private String GetDoctorName(int position) {
        Doctor[] doctors = listAppointment.get(position).getDoctor();
        if (doctors != null && doctors.length > 0) {
            String firstName = null, lastName = null;
            for (Doctor doctor : doctors) {
                firstName = doctor.getFirstName() == null ? "NONE" : doctor.getFirstName();
                lastName = (doctor.getLastName() == null ? "" : doctor.getLastName());
            }
            return firstName + lastName;
        }
        return "NONE";
    }
}
