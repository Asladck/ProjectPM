package grpcserver

import (
	"Pjpro/internal/proto"
	"bytes"
	"context"
	"encoding/json"
	"net"
	"net/http"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

type GRPCServer struct {
	proto.UnimplementedAttendanceAPIServer
}

func (s *GRPCServer) MarkAttendance(ctx context.Context, req *proto.MarkRequest) (*proto.MarkResponse, error) {

	// делаем REST запрос в Java Attendance Service
	body, _ := json.Marshal(map[string]string{
		"studentId": req.StudentId,
		"sessionId": req.SessionId,
		"status":    req.Status,
	})

	resp, err := http.Post(
		"http://attendance-service:8080/attendance",
		"application/json",
		bytes.NewBuffer(body),
	)

	if err != nil {
		return &proto.MarkResponse{Ok: false, Message: err.Error()}, nil
	}

	if resp.StatusCode != 201 {
		return &proto.MarkResponse{Ok: false, Message: resp.Status}, nil
	}

	return &proto.MarkResponse{Ok: true, Message: "Attendance recorded"}, nil
}

func StartGRPC() (*grpc.Server, error) {
	lis, err := net.Listen("tcp", ":50051")
	if err != nil {
		return nil, err
	}

	server := grpc.NewServer()
	proto.RegisterAttendanceAPIServer(server, &GRPCServer{})
	reflection.Register(server)

	go func() {
		server.Serve(lis)
	}()

	return server, nil
}
