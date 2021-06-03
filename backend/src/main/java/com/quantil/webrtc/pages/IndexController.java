package com.quantil.webrtc.pages;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping
public class IndexController {
	private static Logger logger = LoggerFactory.getLogger(IndexController.class);


	@GetMapping(value = "/")
	public String rootIndex() {
		return "index";
	}

	@GetMapping(value = "/p/**")
	public String pages() {
		return "index";
	}


//	/**
//	 * 注册，登陆，密码重置等待都可以放这里
//	 * @return
//	 */
//	@GetMapping("/p/user/**")
//	public String userLogin(){
//		return "/p/index";
//	}

//
//	@GetMapping("/exception/**")
//	public String exception(){
//		return "index";
//	}
}
