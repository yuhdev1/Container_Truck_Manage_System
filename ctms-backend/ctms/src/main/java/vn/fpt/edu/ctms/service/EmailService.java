package vn.fpt.edu.ctms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import vn.fpt.edu.ctms.model.User;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendSimpleMessage(String email, String username, String password,String userNumber) {
        String subject = "Thông tin Tài khoản của bạn";

        String emailContent = "Xin chào,\n\n"
                + "Dưới đây là thông tin tài khoản của bạn:\n\n"
                + "Mã người dùng: " + userNumber + "\n"
                + "Tên đăng nhập: " + username + "\n"
                + "Mật khẩu: " + password + "\n\n"
                + "Xin hãy lưu thông tin này một cách cẩn thận và không chia sẻ với bất kỳ ai khác. "
                + "Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.\n\n"
                + "Trân trọng,\n"
                + "CTMS";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject(subject);
        message.setText(emailContent);
        emailSender.send(message);
    }

    public void sendOtp(String email, String otp) {
        String subject = "Lấy lại mật khẩu - CTMS";

        String emailContent = "Xin chào,\n\n"
                + "Mã xác nhận của bạn là:" + otp + "\n\n"
                + "Vui lòng không chia sẻ mã này với bất kỳ ai khác."
                + "Mã xác nhận chỉ có hiệu lực trong vòng 10 phút.\n\n"
                + "Trân trọng,\n"
                + "CTMS";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject(subject);
        message.setText(emailContent);
        emailSender.send(message);
    }
}