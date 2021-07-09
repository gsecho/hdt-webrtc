package com.quantil.webrtc.pages;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping
public class IndexController {

	@GetMapping(value = "/")
	public String rootIndex() {
		return "index";
	}

	@GetMapping(value = "/p/**")
	public String pages() {
		return "index";
	}

}
