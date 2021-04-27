package com.quantil.webrtc.pages;

import com.quantil.webrtc.core.annotation.PassToken;
import com.quantil.webrtc.core.bean.UrlProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;

@Controller
@RequestMapping
public class IndexController {
	private static Logger logger = LoggerFactory.getLogger(IndexController.class);
	
	@Resource
	private UrlProperties urlProperties;

	@PassToken
	@GetMapping(value = "/")
	public String rootIndex() {
		return "index";
	}

	/**
	 * 注册，登陆，密码重置等待都可以放这里
	 * @return
	 */
	@PassToken
	@GetMapping("/p/user/**")
	public String userLogin(){
		return "index";
	}

	@PassToken
	@GetMapping(value = "/p/**")
	public String pages() {
		return "index";
	}

	@PassToken
	@GetMapping("/exception/**")
	public String exception(){
		return "index";
	}
}
