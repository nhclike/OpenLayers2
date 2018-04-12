package webmap;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SchedulerFactory;
import org.quartz.SimpleScheduleBuilder;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.impl.StdSchedulerFactory;

public class StartupServlet extends HttpServlet{
	
	Scheduler sched = null;
	
	public void init(ServletConfig cfg) throws ServletException{
		
		
		try {
			SchedulerFactory sf = new StdSchedulerFactory();
			sched = sf.getScheduler();
		
		
		JobDetail job = JobBuilder.newJob(MyJob.class)
				.withIdentity("job1", "group1").build();
		Trigger trigger = TriggerBuilder.newTrigger()
				.withIdentity("trigger1", "group1")
				.startNow()
				.withSchedule(SimpleScheduleBuilder.simpleSchedule()
						.withIntervalInMinutes(60).repeatForever()).build();
		sched.scheduleJob(job, trigger);
		sched.start();
		
		} catch (SchedulerException e) {
			e.printStackTrace();
		}
	}
	
	public void destory(){
		
		if(sched!=null){
			
			try {
				sched.shutdown();
			} catch (SchedulerException e) {
				e.printStackTrace();
			}
			
		}
		
	}



}
