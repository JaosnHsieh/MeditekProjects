//
//  RequestRepresentation.swift
//
//  Copyright (c) 2015 Netguru Sp. z o.o. All rights reserved.
//

import Foundation

/// Represents a request.
public final class RequestRepresentation {

	/// Request method.
	public let method: String

	/// Request URL string.
	public let url: String

	/// Request headers, represented by strings.
	public let headers: [String: String]

	/// Request content type.
	public var contentType: String? {
		return headers["Content-Type"]
	}

	/// Request body input stream.
	public let bodyStream: NSInputStream?

	/// Request body data. Most requests will have only a stream available, so
	/// accessing this property will lazily open the stream and drain it in a
	/// thread-blocking manner.
	public var bodyData: NSData? {
		return bodyStream.flatMap { stream in
			let data = NSMutableData()
			stream.open()
			while stream.hasBytesAvailable {
				var buffer = [UInt8](count: 1024, repeatedValue: 0)
				let length = stream.read(&buffer, maxLength: buffer.count)
				data.appendBytes(buffer, length: length)
			}
			stream.close()
			return data
		}
	}

	/// Request body UTF-8 string.
	public var bodyUTF8String: String? {
		return bodyData.flatMap { NSString(data: $0, encoding: NSUTF8StringEncoding) } as String?
	}

	/// Initializes the receiver with an instance of NSURLRequest.
	///
	/// - parameter request: The foundation NSSURLRequest object.
	///
	/// - returns: An initialized receiver or nil if an instance should not be
	/// created using the given request.
	public init?(_ request: NSURLRequest) {
		if let url = request.URL?.absoluteString {
			self.method = request.HTTPMethod ?? "GET"
			self.url = url
			self.headers = request.allHTTPHeaderFields ?? [:]
			self.bodyStream = {
				if let bodyData = request.HTTPBody {
					return NSInputStream(data: bodyData)
				} else if let bodyStream = request.HTTPBodyStream {
					return bodyStream
				} else {
					return nil
				}
			}()
		} else {
			self.method = String()
			self.url = String()
			self.headers = Dictionary()
			self.bodyStream = nil
			return nil
		}
	}

}

// MARK: -

extension RequestRepresentation: CustomStringConvertible {

	public var description: String {
		return "\(method) \(url)"
	}

}
